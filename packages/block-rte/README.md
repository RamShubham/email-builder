# Block RTE (Rich Text Editor)

A powerful rich text editor built with Lexical for EmailBuilder.js. This package provides a customizable, feature-rich text editing experience with a floating toolbar menu.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Components](#components)
- [Customization](#customization)
- [Lexical Deep Dive](#lexical-deep-dive)

## Features

- 🎯 Floating toolbar menu
- 📝 Text formatting (bold, italic, underline)
- 📋 List support (ordered and unordered)
- 🔗 Link management
- 🎨 Customizable styling
- 📱 Responsive design
- 🔄 Real-time content updates

## Installation

```bash
npm install block-rte
```

## Usage

```tsx
import { Rte } from 'block-rte';

function MyComponent() {
	const handleChange = (data) => {
		console.log('Editor content:', data.content);
		console.log('HTML output:', data.html);
	};

	return (
		<Rte content={initialContent} onChange={handleChange} padding="md" />
	);
}
```

## Architecture

### Lexical Integration

This package uses [Lexical](https://lexical.dev/), a powerful text editor framework. Here's how we've integrated it:

1. **Editor Configuration**

```tsx
const initialConfig = {
	namespace: 'MyEditor',
	theme: {
		// Custom theme configuration
	},
	nodes: [ListNode, ListItemNode, LinkNode, CustomParagraphNode],
	onError: (error) => console.error(error),
};
```

2. **Custom Nodes**
   We've extended Lexical's base nodes to add custom functionality:

```tsx
// CustomParagraphNode.tsx
export class CustomParagraphNode extends ParagraphNode {
	createDOM(): HTMLElement {
		const dom = document.createElement('div');
		dom.style.margin = '0';
		return dom;
	}
}
```

### Floating Menu Implementation

The floating menu is implemented using a combination of Lexical commands and React components:

1. **Menu Structure**

```tsx
function FloatingMenu({ editor, coords }) {
	return (
		<div className={styles.container}>
			{/* Text Formatting */}
			<FormatButtons editor={editor} />
			<div className={styles.divider} />

			{/* List Controls */}
			<ListButtons editor={editor} />
			<div className={styles.divider} />

			{/* Link Controls */}
			<LinkButton editor={editor} />
		</div>
	);
}
```

2. **Command Handling**

```tsx
const handleFormatClick = (format) => {
	editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
};

const handleListClick = (type) => {
	editor.dispatchCommand(
		type === 'ordered'
			? INSERT_ORDERED_LIST_COMMAND
			: INSERT_UNORDERED_LIST_COMMAND
	);
};
```

3. **Positioning**
   The menu uses the `@floating-ui/dom` library for positioning:

```tsx
const { x, y } = useFloatingMenu({
	editor,
	floatingMenuRef,
});
```

## Components

### Rte

The main component that wraps the Lexical editor and its plugins.

Props:

- `content`: Initial editor content
- `onChange`: Callback for content changes
- `padding`: Spacing around the editor ('sm' | 'md' | 'lg')

### FloatingMenu

A floating toolbar that appears when text is selected.

Features:

- Text formatting controls
- List controls
- Link insertion
- Custom styling
- Responsive positioning

### LinkPopover

A popover for managing links:

- URL input
- Link creation/editing
- Link removal

## Customization

### Styling

The editor can be customized using CSS modules:

```scss
// styles.module.scss
.container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem;
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.divider {
	width: 1px;
	height: 24px;
	background-color: #e0e0e0;
}
```

### Adding New Features

1. **New Commands**

```tsx
const MY_CUSTOM_COMMAND = createCommand('MY_CUSTOM_COMMAND');

editor.registerCommand(
	MY_CUSTOM_COMMAND,
	(payload) => {
		// Handle command
		return true;
	},
	COMMAND_PRIORITY_NORMAL
);
```

2. **New Nodes**

```tsx
export class CustomNode extends ElementNode {
	static getType(): string {
		return 'custom-node';
	}

	createDOM(): HTMLElement {
		const dom = document.createElement('div');
		// Custom DOM setup
		return dom;
	}
}
```

## Lexical Deep Dive

### Custom Commands

Commands in Lexical are like actions that can be triggered to modify the editor's content. Here's how we use them:

1. **Creating a Command**

```tsx
// Define a new command
const LINK_CLICK_COMMAND = createCommand('LINK_CLICK_COMMAND');

// Define the command payload type
type LinkClickData = {
	url: string;
	domElement: HTMLElement;
	position: { x: number; y: number };
};
```

2. **Registering a Command Handler**

```tsx
// In your plugin or component
useEffect(() => {
	const removeCommand = editor.registerCommand(
		LINK_CLICK_COMMAND,
		(payload: LinkClickData) => {
			// Handle the command
			console.log('Link clicked:', payload.url);
			return true; // Return true if command was handled
		},
		COMMAND_PRIORITY_NORMAL
	);

	return () => removeCommand();
}, [editor]);
```

3. **Dispatching a Command**

```tsx
// Trigger the command
editor.dispatchCommand(LINK_CLICK_COMMAND, {
	url: 'https://example.com',
	domElement: linkElement,
	position: { x: 100, y: 100 },
});
```

### Editor Methods Explained

1. **dispatchCommand**

```tsx
// Sends a command to the editor
editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
```

- Think of it as sending a message to the editor
- First argument is the command type
- Second argument is the command data
- Returns true if command was handled

2. **registerCommand**

```tsx
// Listen for specific commands
editor.registerCommand(
	FORMAT_TEXT_COMMAND,
	(format) => {
		// Handle the command
		return true;
	},
	COMMAND_PRIORITY_NORMAL
);
```

- Like adding an event listener for specific commands
- Returns a function to remove the listener
- Priority determines order of execution

3. **registerUpdateListener**

```tsx
// Listen for any editor changes
const removeUpdateListener = editor.registerUpdateListener(
	({ editorState, dirtyElements, dirtyLeaves }) => {
		// Handle editor updates
		console.log('Editor state changed');
	}
);
```

- Like a general change listener
- Called whenever the editor content changes
- Useful for syncing with external state

4. **getEditorState**

```tsx
// Get current editor state
const editorState = editor.getEditorState();
```

- Returns a snapshot of the editor's content
- Can be serialized to JSON
- Used for saving/loading content

5. **update**

```tsx
// Make changes to the editor
editor.update(() => {
	// Your changes here
	const selection = $getSelection();
	if ($isRangeSelection(selection)) {
		selection.insertText('Hello World');
	}
});
```

- Like a transaction
- All changes are batched together
- Must be used for any content modifications
