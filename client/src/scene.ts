import { v4 as uuid } from 'uuid';
import Dialogue from './dialogue';
import { Edge } from '@vue-flow/core';

export default class Scene {
    id: string;
    name: string;
    description: string;
    dialogues: Dialogue[]; // Used by Vue Flow
    edges: Edge[]; // Used by Vue Flow
    remoteId: string; // Optional id, used to link to a live state machine

    constructor(name: string) {
        this.id = this.remoteId = uuid(); // Use the same ID for both
        this.name = name;
        this.description = '';
        this.dialogues = [];
        this.edges = [];
    }
}
