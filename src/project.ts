import Scene from '@/scene';
import { Edge } from '@vue-flow/core';
import JSZip from 'jszip';
import { v4 as uuid } from 'uuid';
import { hashString } from './utils/hash-util';
import { toFileName } from './utils/naming-util';

type EntryExitAction = {
    type: string;
    params: {
        cmd: string;
        addr: string;
        value: string;
    }[];
};

type ExportedState = {
    on: Record<string, { target: string }>; // Example: { "on": { "some-event-name": { target: "some-target" } } }
    entry: EntryExitAction[];
    exit: EntryExitAction[];
};

type ExportedScene = {
    id: string;
    name: string;
    description: string;
    conditionsMap: Record<string, any>;
    flow: {
        id: string;
        initial: string;
        states: Record<string, ExportedState>;
    };
};

export default class Project {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    scenes: Scene[];

    constructor(name: string) {
        this.id = uuid();
        this.name = name;
        this.description = '';
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.scenes = [];
    }

    static saveToFile(fileName: string, project: Project) {
        console.log('Saving project to file...');
        const projectData = JSON.stringify(project, null, 2);
        // Force download
        const blob = new Blob([projectData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static exportForDaliSys(fileName: string, project: Project) {
        console.log('Exporting project for DaliSys...');
        // For the project:
        // Create a zip file containing a folder for each scene
        // Create a meta file with the project name and description

        // For each scene:
        // Export three files contained in a zip file
        // 1. {scene-name}/conditions-map.json
        // 2. {scene-name}/flow.json
        // 3. {scene-name}/meta.md // Scene name and description

        const exportedScenes: ExportedScene[] = [];

        project.scenes.forEach((scene) => {
            const conditionsMap: Record<string, any> = {}; // Map to store conditions to deterministic ids
            const flow = {
                id: scene.id,
                initial: scene.dialogues[0].id,
                states: {} as Record<string, ExportedState>
            };

            scene.dialogues.forEach((dialogue) => {
                const exportedState: ExportedState = {
                    on: {},
                    entry: [],
                    exit: []
                };

                // Add conditions
                dialogue.data.options.forEach((option) => {
                    // Determine the target based on an edge
                    const connectedEdge: Edge | undefined = scene.edges.find((edge) => edge.sourceHandle === option.id);
                    // Generate an id that can be reproduced for the condition
                    const generatedConditionId = hashString(
                        `${option.condition?.address}-${option.condition?.command}`
                    );

                    // Add the condition to the conditionsMap
                    conditionsMap[generatedConditionId] = option.condition;

                    if (connectedEdge) {
                        const { target } = connectedEdge;
                        if (target) exportedState.on[generatedConditionId] = { target };
                        else console.error('Target handle not found for edge:', connectedEdge);
                    } else console.error('Edge not found for option:', option.id);
                });

                // TODO: Add entry and exit actions

                flow.states[dialogue.id] = exportedState;
            });

            const exportedScene: ExportedScene = {
                id: scene.id,
                name: scene.name,
                description: scene.description,
                conditionsMap,
                flow
            };

            exportedScenes.push(exportedScene);
        });

        // Save the zip file to the file system using the exportedScenes array
        const zip = new JSZip();
        exportedScenes.forEach((scene) => {
            const folder = zip.folder(toFileName(scene.name));
            if (!folder) {
                // Skip if folder creation fails
                console.error('Folder creation failed for scene:', scene.name);
            } else {
                folder.file('meta.md', `# ${scene.name}\n\n${scene.description}`);
                folder.file('conditions-map.json', JSON.stringify(scene.conditionsMap, null, 2));
                folder.file('flow.json', JSON.stringify(scene.flow, null, 2));
            }
        });

        // Create a meta file for the project
        zip.file('meta.md', `# ${project.name}\n\n${project.description}`);

        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                // Force download
                const blob = new Blob([content], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error generating zip file:', error);
            });

        console.log('Export complete!');
    }
}
