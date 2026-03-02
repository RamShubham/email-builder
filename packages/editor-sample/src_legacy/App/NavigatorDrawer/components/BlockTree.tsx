import React, { useEffect, useState } from 'react';

import { SortableContext } from '@dnd-kit/sortable';
import { Collapse, List } from '@mui/material';

import SortableTreeItem from './SortableTreeItem';

type BlockTreeProps = {
	items: any[];
	level?: number;
	handleBlockClick: (id: string) => void;
	toggleExpanded: (id: string) => void;
	expandedBlocks: Record<string, boolean>;
};

function BlockTree({
	items,
	level = 0,
	handleBlockClick,
	toggleExpanded,
	expandedBlocks,
}: BlockTreeProps) {
	const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set());

	// Track new items for slide-in animation
	useEffect(() => {
		const newItems = items.filter((item) => !animatedItems.has(item.id));
		if (newItems.length > 0) {
			newItems.forEach((item) => {
				setTimeout(() => {
					setAnimatedItems((prev) => new Set(prev).add(item.id));
				}, level * 50); // Staggered delay based on level
			});
		}
	}, [items, animatedItems, level]);

	return (
		<SortableContext items={items.map((item) => item.id)}>
			{items.map((item, index) => {
				const hasChildren = item.children.length > 0;
				const isExpanded = Boolean(!expandedBlocks[item.id]); // Default to expanded
				const isAnimated = animatedItems.has(item.id);

				return (
					<React.Fragment key={item.id}>
						<div
							style={{
								opacity: isAnimated ? 1 : 0,
								transform: isAnimated
									? 'translateX(0)'
									: 'translateX(-20px)',
								transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`,
							}}
						>
							<SortableTreeItem
								item={item}
								level={level}
								handleBlockClick={handleBlockClick}
								toggleExpanded={toggleExpanded}
								isExpanded={isExpanded}
							/>
						</div>

						{hasChildren && (
							<Collapse
								in={isExpanded}
								timeout={300}
								easing={{
									enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
									exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
								}}
								unmountOnExit
								sx={{
									'& .MuiCollapse-wrapper': {
										transition:
											'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									},
									'& .MuiCollapse-wrapperInner': {
										transition:
											'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									},
								}}
							>
								<List
									component="div"
									disablePadding
									dense
									sx={{
										transform: isExpanded
											? 'translateY(0)'
											: 'translateY(-10px)',
										opacity: isExpanded ? 1 : 0,
										transition:
											'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									}}
								>
									<BlockTree
										items={item.children}
										level={level + 1}
										handleBlockClick={handleBlockClick}
										toggleExpanded={toggleExpanded}
										expandedBlocks={expandedBlocks}
									/>
								</List>
							</Collapse>
						)}
					</React.Fragment>
				);
			})}
		</SortableContext>
	);
}

export default BlockTree;
