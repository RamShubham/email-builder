import { useEffect } from 'react';

import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	Modifier,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Box, Stack, useTheme } from '@mui/material';

import {
	setDocument,
	useDocument,
	useGlobalLoader,
	useInspectorDrawerOpen,
	useSamplesDrawerOpen,
	useVariables,
} from '../documents/editor/EditorContext';
import { replaceTemplateVariables } from '../utils/replaceTemplateVariables';

import GlobalLoader from './GlobalLoader';
import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import Navbar from './Navbar';
import NavigatorDrawer, { NAVIGATOR_DRAWER_WIDTH } from './NavigatorDrawer';
import TemplatePanelLoader from './TemplateLoader';
import TemplatePanel from './TemplatePanel';

function useDrawerTransition(
	cssProperty: 'margin-left' | 'margin-right',
	open: boolean
) {
	const { transitions } = useTheme();
	return transitions.create(cssProperty, {
		easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
		duration: !open
			? transitions.duration.leavingScreen
			: transitions.duration.enteringScreen,
	});
}

const conditionalModifiers: Modifier = (args) => {
	const { active, over } = args;
	const { id, data } = active || {};

	const activeParentType = data?.current?.parentType;
	const overParentType = over?.data?.current?.parentType;

	// If the drag comes from the sortable list
	if (
		typeof id === 'string' &&
		id.startsWith('block-') &&
		![activeParentType, overParentType].includes('ColumnsContainer')
	) {
		return restrictToVerticalAxis({
			...args,
			transform: restrictToWindowEdges(args),
		});
	}

	// For component1 drags
	return restrictToWindowEdges(args);
};

export default function App() {
	const globalLoader = useGlobalLoader();
	const inspectorDrawerOpen = useInspectorDrawerOpen();
	const samplesDrawerOpen = useSamplesDrawerOpen();

	const marginLeftTransition = useDrawerTransition(
		'margin-left',
		samplesDrawerOpen
	);
	const marginRightTransition = useDrawerTransition(
		'margin-right',
		inspectorDrawerOpen
	);

	const globalVariables = useVariables();
	const document = useDocument();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(TouchSensor)
	);

	//update document (blocks) on global variable changes
	useEffect(() => {
		if (Object.keys(globalVariables).length > 0) {
			const updatedDocument = Object.entries(document).reduce(
				(acc, [blockId, { data, type }]) => {
					if (!data) {
						acc[blockId] = {
							data: { props: {}, template: {} },
							type,
						};
						return acc;
					}

					const { props, template } = data || {};

					// If no props exist, retain the original block structure
					if (!props || !template) {
						acc[blockId] = { data, type };
						return acc;
					}

					// Process props and replace template variables
					const updatedProps = replaceTemplateVariables(
						template,
						globalVariables
					);

					// Store the updated block in the result document
					acc[blockId] = {
						type,
						data: { ...data, props: updatedProps },
					};
					return acc;
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{} as Record<string, any>
			);

			setDocument(updatedDocument);
		}
	}, [globalVariables]);

	return (
		<>
			<Navbar />
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				modifiers={[conditionalModifiers]}
			>
				<Box sx={{ position: 'relative' }}>
					<TemplatePanelLoader />

					<InspectorDrawer />
					<NavigatorDrawer />

					<Stack
						sx={{
							marginRight: inspectorDrawerOpen
								? `${INSPECTOR_DRAWER_WIDTH}px`
								: 0,
							marginLeft: samplesDrawerOpen
								? `${NAVIGATOR_DRAWER_WIDTH}px`
								: 0,
							transition: [
								marginLeftTransition,
								marginRightTransition,
							].join(', '),
						}}
					>
						<TemplatePanel />
					</Stack>
				</Box>
			</DndContext>

			{globalLoader ? <GlobalLoader /> : null}
		</>
	);
}
