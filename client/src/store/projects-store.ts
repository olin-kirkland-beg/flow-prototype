import Dialogue, { DialogueOption } from '@/dialogue';
import Project from '@/project';
import Scene from '@/scene';
import { Edge, MarkerType } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { v4 as uuid } from 'uuid';

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref<Project[]>([]);

    // Watch for changes and save to localStorage
    watch(
        projects,
        (newProjects) => {
            localStorage.setItem('projects', JSON.stringify(newProjects));
        },
        { deep: true }
    );

    // Load projects from localStorage
    function loadProjectsFromLocalStorage(): void {
        const storedProjects = localStorage.getItem('projects');
        projects.value = storedProjects ? JSON.parse(storedProjects) : [];
    }

    // Estimate bytes used by projects in localStorage
    function bytesUsedEstimate() {
        const jsonString = JSON.stringify(projects.value);
        const bytesCount = new Blob([jsonString]).size;
        return bytesCount;
    }

    // Get a project by ID
    function getProject(id: string): Project | undefined {
        return projects.value.find((project) => project.id === id);
    }

    // Add a new project
    function addProject(project: Project): void {
        projects.value.push(project);
    }

    // Remove a project by ID
    function removeProject(id: string): void {
        projects.value = projects.value.filter((project) => project.id !== id);
    }

    // Get a scene by ID
    function getScene(projectId: string, sceneId: string): Scene | undefined {
        const project = getProject(projectId);
        if (!project) return undefined; // Project not found
        return project.scenes.find((scene) => scene.id === sceneId);
    }

    // Add a scene to a project
    function addScene(projectId: string, scene: Scene): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        project.scenes.push(scene);
    }

    // Remove a scene from a project
    function removeScene(projectId: string, sceneId: string): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        project.scenes = project.scenes.filter((scene) => scene.id !== sceneId);
    }

    // Get a dialogue by ID
    function getDialogue(projectId: string, sceneId: string, dialogueId: string): Dialogue | undefined {
        const project = getProject(projectId);
        if (!project) return undefined; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return undefined; // Scene not found
        return scene.dialogues.find((dialogue) => dialogue.id === dialogueId);
    }

    // Get an option by ID
    function getOption(
        projectId: string,
        sceneId: string,
        dialogueId: string,
        optionId: string
    ): DialogueOption | undefined {
        const project = getProject(projectId);
        if (!project) return undefined; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return undefined; // Scene not found
        const dialogue = scene.dialogues.find((d) => d.id === dialogueId);
        if (!dialogue) return undefined; // Dialogue not found
        return dialogue.data.options.find((option) => option.id === optionId);
    }

    // Add a dialogue to a scene
    function addDialogue(projectId: string, sceneId: string, dialogue: Dialogue): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        scene.dialogues.push(dialogue);
    }

    // Remove a dialogue from a scene
    function removeDialogue(projectId: string, sceneId: string, dialogueId: string): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogueIndex = scene.dialogues.findIndex((dialogue) => dialogue.id === dialogueId);
        if (dialogueIndex === -1) return; // Dialogue not found
        scene.dialogues = scene.dialogues.filter((dialogue) => dialogue.id !== dialogueId);
        cleanEdges();
    }

    // Add an option to a dialogue
    function addOption(projectId: string, sceneId: string, dialogueId: string, option: DialogueOption): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogue = scene.dialogues.find((d) => d.id === dialogueId);
        if (!dialogue) return; // Dialogue not found
        dialogue.data.options.push(option);
    }

    // Remove an option from a dialogue
    function removeOption(projectId: string, sceneId: string, dialogueId: string, optionId: string): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogue = scene.dialogues.find((d) => d.id === dialogueId);
        if (!dialogue) return; // Dialogue not found
        const optionIndex = dialogue.data.options.findIndex((option) => option.id === optionId);
        if (optionIndex === -1) return; // Option not found
        dialogue.data.options = dialogue.data.options.filter((option) => option.id !== optionId);
        cleanEdges();
    }

    // Add an edge
    function addEdge(
        projectId: string,
        sceneId: string,
        sourceId: string,
        sourceHandleId: string,
        targetId: string // Not a handle
    ): void {
        const edge: Edge = {
            id: uuid(),
            source: sourceId,
            sourceHandle: sourceHandleId,
            target: targetId,
            markerEnd: {
                type: MarkerType.Arrow,
                width: 10,
                height: 10,
                strokeWidth: 2,
                color: 'var(--color-on-surface)'
            },
            style: {
                stroke: 'var(--color-on-surface)',
                strokeWidth: 2
            }
        };

        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scenpe not found
        scene.edges.push(edge);
    }

    // Remove an edge (unlink an option)
    function removeEdge(projectId: string, sceneId: string, edgeId: string): void {
        console.log('Removing edge:', edgeId);

        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found

        console.log(
            'Edges:',
            scene.edges.map((edge) => edge.id)
        );

        scene.edges = scene.edges.filter((edge) => edge.id !== edgeId);
        console.log(
            'Edges after removal:',
            scene.edges.map((edge) => edge.id)
        );
    }

    function cleanEdges() {
        // Edges with a missing source or target should be removed
        projects.value.forEach((project) => {
            project.scenes.forEach((scene) => {
                scene.edges = scene.edges.filter(
                    (edge) =>
                        project.scenes.some((s) => s.id === edge.source) &&
                        project.scenes.some((s) => s.id === edge.target)
                );
            });
        });
    }

    return {
        projects,
        loadProjectsFromLocalStorage,
        bytesUsedEstimate,
        getProject,
        addProject,
        removeProject,
        getScene,
        addScene,
        removeScene,
        getDialogue,
        getOption,
        addDialogue,
        removeDialogue,
        addOption,
        removeOption,
        addEdge,
        removeEdge
    };
});
