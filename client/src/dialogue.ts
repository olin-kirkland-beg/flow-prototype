import { v4 as uuid } from 'uuid';

export type DialogueOption = {
    id: string; // UUID
    label: string; // Label for the option
    condition: { address: string; command: string; value?: string } | null; // Condition to show this option (null if no condition)
};

export type Action = {
    address: string; // Address to send the action to (e.g, usb1:sa9, usb3:gr1)
    command: string; // Command to send (e.g, OFF,
};

export default class Dialogue {
    id: string; // UUID
    type: string = 'dialogue'; // Always 'dialogue' (Vue Flow uses this to identify the node type)
    data: {
        label: string; // Label for the dialogue node
        options: DialogueOption[]; // Array of options for the dialogue node
        actions: Action[]; // Actions to perform when this dialogue is selected
    };
    position: {
        x: number; // X position of the node in the flow diagram
        y: number; // Y position of the node in the flow diagram
    };

    constructor() {
        this.id = uuid();
        this.data = {
            label: '',
            options: [],
            actions: []
        };
        this.position = { x: 0, y: 0 };
    }
}
