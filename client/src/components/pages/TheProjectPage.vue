<template>
    <div v-if="project" class="page page--project">
        <!-- Vue Flow Component -->
        <VueFlow
            :nodes="selectedScene?.dialogues"
            :edges="selectedScene?.edges"
            :snap-to-grid="true"
            :snap-grid="[16, 16]"
            :zoom-on-double-click="false"
            :connection-mode="ConnectionMode.Strict"
            :connection-radius="40"
            @connect="onConnect"
            v-on:nodes-change="onNodesChange"
            @connect-start="onConnectStart"
            @connect-end="onConnectEnd"
        >
            <Background :gap="16" :offset="0" />

            <template
                #node-dialogue="dialogueNodeProps"
                v-on:drag="dialogueNodeProps.onDrag"
                v-on:dragend="dialogueNodeProps.setPosition"
            >
                <DialogueNode v-bind="dialogueNodeProps" :seekingNodeId="seekingNodeId" />
            </template>

            <template #connection-line="props">
                <CustomAnimatedEdge v-bind="props" />
            </template>
        </VueFlow>
        <ProjectSidebar
            v-if="flowInstance"
            :project="project"
            :selectedScene="selectedScene"
            :selectedDialogue="selectedDialogue"
            @selectScene="selectScene"
            @selectDialogue="selectDialogueById"
            :isConnected="isConnected"
            :isConnecting="isConnecting"
            :socketErrorMessage="socketErrorMessage"
            :serverUrl="serverUrl"
            :isFollowing="isFollowing"
            :currentDialogueId="currentDialogueId"
        />

        <DialogueSidebar
            v-if="flowInstance && selectedScene"
            :project="project"
            :selectedScene="selectedScene"
            :selectedDialogue="selectedDialogue"
            @selectDialogue="selectDialogueById"
            @deselectDialogue="selectedDialogue = null"
            @panToDialogue="panToNode"
        />
    </div>
    <div v-else class="page page--project-not-found">
        <p>{{ t('Project.not-found') }}</p>
        <Button @click="router.push({ name: PageName.HOME })">
            <i class="fas fa-chevron-left"></i>
            <span>{{ t('Project.back-to-home') }}</span>
        </Button>
    </div>
</template>

<script setup lang="ts">
import DialogueNode from '@/components/flow/DialogueNode.vue';
import Button from '@/components/ui/Button.vue';
import Dialogue from '@/dialogue';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { Background } from '@vue-flow/background';
import { Connection, ConnectionMode, Edge, NodeChange, useVueFlow, VueFlow, VueFlowStore } from '@vue-flow/core';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DialogueSidebar from '../DialogueSidebar.vue';
import ProjectSidebar from '../ProjectSidebar.vue';
import CustomAnimatedEdge from '../flow/CustomAnimatedEdge.vue';

const { onPaneReady, toObject, updateNode } = useVueFlow();

const route = useRoute();

const flowInstance = ref<VueFlowStore | null>(null);

const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(projectsStore.getProject(projectId.value as string) || null);

const selectedScene = ref<Scene | null>(null);
const selectedDialogue = ref<Dialogue | null>(null);
const seekingNodeId = ref<string | null>(null); // Used to track the node being dragged from

// Manage live state changes from server
let ws: WebSocket | null = null;
const socketErrorMessage = ref<string | null>(null);
const serverUrl = ref<string>('localhost'); // Default server URL
const isConnected = ref<boolean>(false);
const isConnecting = ref<boolean>(false);
const isFollowing = ref<boolean>(false);
const currentDialogueId = ref<string | null>(null);

function connect() {
    try {
        ws = new WebSocket(`ws://${serverUrl.value}:3002`);
        socketErrorMessage.value = null;
        ws.onopen = () => {
            isConnecting.value = false;
            isConnected.value = true;
        };

        ws.onmessage = (event) => {
            const { data } = JSON.parse(event.data);
            if (!data) return console.warn('No data in event', event.data);
            const { stateMachineId, newState } = data;
            if (selectedScene.value?.remoteId !== stateMachineId) return;
            currentDialogueId.value = newState;
        };

        ws.onerror = (e) => {
            console.error('WebSocket error', e);
            socketErrorMessage.value = 'Error: Cannot connect to server';
            isConnecting.value = isConnected.value = false;
            ws = null;
        };

        ws.onclose = () => {
            isConnecting.value = isConnected.value = false;
            ws = null;
        };
    } catch (e) {
        socketErrorMessage.value = 'Error:' + e;
        isConnecting.value = isConnected.value = false;
        ws = null;
    }
}

function disconnect() {
    if (!ws) return console.log('Not connected');
    ws.close();
    ws = null;
    isConnected.value = false;
}

onMounted(() => {
    connect();
});

onUnmounted(() => {
    disconnect();
});

// Initialize once the VueFlow instance is ready
onPaneReady((vueFlowStore: VueFlowStore) => {
    // console.log('VueFlow instance ready', vueFlowStore);
    flowInstance.value = vueFlowStore;
    flowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });
    selectedScene.value = project.value!.scenes[0] || null;
});

// Watch selectedScene.id, load the correct nodes and edges
watch(() => selectedScene.value?.id, populateScene);

// Watch for changes in the project, and update the updatedAt field
// Unless the updatedAt field itself is changed, in which case we don't want to trigger the watch again
watch(
    () => project.value,
    (newProject) => {
        if (!newProject) return;
        const oldUpdatedAt = project.value?.updatedAt || 0;
        const newUpdatedAt = newProject.updatedAt || 0;
        if (oldUpdatedAt !== newUpdatedAt) return; // Don't trigger if updatedAt is changed
        newProject.updatedAt = Date.now();
    },
    { deep: true }
);

// Watch for changes to the scenes in the project, and update the selectedScene if it no longer exists
watch(
    () => project.value?.scenes.map((scene) => scene.id),
    (sceneIds) => {
        if (!selectedScene.value) return;

        console.log('Watching project scenes', sceneIds, selectedScene.value.id);
        if (!sceneIds?.includes(selectedScene.value.id)) {
            selectedScene.value = null;
            flowInstance.value?.setNodes([]);
        }
    }
);

// Update a node when any of its data changes
watch(
    () => selectedDialogue.value?.data,
    (newLabel) => {
        if (!selectedDialogue.value) return;
        updateNode(selectedDialogue.value.id, {
            data: {
                ...selectedDialogue.value.data
            }
        });
    },
    { deep: true }
);

function onConnectStart(event?: any) {
    const nodeId = event.nodeId;
    seekingNodeId.value = nodeId;
}

function onConnectEnd() {
    seekingNodeId.value = null;
}

// Load the nodes and edges when the scene changes
function populateScene() {
    if (!flowInstance.value) return;
    selectedDialogue.value = null;
    flowInstance.value.setCenter(0, 0, {
        duration: 0,
        zoom: 1
    });
}

// Apply the flow (nodes and edges) to the project graph
function applyFlowToProject() {
    if (!project.value) return;
    const projectObject = toObject();
    project.value.scenes.forEach((scene) => {
        scene.dialogues.forEach((dialogue) => {
            const node = projectObject.nodes.find((node) => node.id === dialogue.id);
            if (node) {
                dialogue.position = node.position;
                dialogue.data = node.data;
            }
        });
    });
}

// When a node is clicked in the flow, update the selectedDialogue
function onNodesChange(changes: NodeChange[]) {
    changes.forEach((change) => {
        // When selection change happens, change selectedDialogue
        switch (change.type) {
            case 'select':
                if (!change.selected) {
                    selectedDialogue.value = null;
                    return;
                }

                const selectedNode = flowInstance.value?.getNode(change.id);
                if (!selectedNode) return;

                const dialogue = selectedScene.value?.dialogues.find((dialogue) => dialogue.id === selectedNode.id);

                if (!dialogue) return;
                setTimeout(() => {
                    // setTimeout here is to ensure the node is selected before we set the selectedDialogue
                    // Multiple changes can happen at once, and we want to ensure the selectedDialogue is set after the node is selected
                    selectedDialogue.value = dialogue;
                }, 0);
                break;
            default:
                break;
        }
    });

    applyFlowToProject();
}

// Select a scene in the project
function selectScene(scene: Scene) {
    selectedScene.value = scene;
}

function selectDialogueById(id: string) {
    if (!selectedScene.value) return;
    const dialogue = projectsStore.getDialogue(project.value!.id, selectedScene.value.id, id);
    if (!dialogue) return;
    selectDialogue(dialogue);
}

// Select a dialogue in the project
function selectDialogue(dialogue: Dialogue) {
    if (!flowInstance.value) return;
    selectedDialogue.value = dialogue;

    const node = flowInstance.value.getNode(dialogue.id);
    if (!node) return;

    // Select the node
    flowInstance.value.getSelectedNodes.forEach((n) => {
        n.selected = false;
    });
    node.selected = true;

    setTimeout(() => {
        // Wait for one frame to ensure the right panel is open before panning to the node
        // Panning takes the UI into account (to center the node in the viewport)
        panToNode(dialogue.id);
    }, 0);
}

// Pan the viewport to the center of the node, taking into account the sidebars
function panToNode(id: string) {
    if (!flowInstance.value) return;
    const node = flowInstance.value.getNode(id);
    if (!node) return;

    // Pan to the node's center
    const leftSidebarOffsetX = ((document.querySelector('.sidebar--left')?.clientWidth || 0) + 32) / 2;

    const rightSidebarOffsetX = ((document.querySelector('.sidebar--right')?.clientWidth || 0) + 32) / 2;

    const centerOffsetX = (node.dimensions.width as number) / 2;
    const centerOffsetY = (node.dimensions.height as number) / 2;
    const center = {
        x: node.position.x + centerOffsetX - leftSidebarOffsetX + rightSidebarOffsetX,
        y: node.position.y + centerOffsetY
    };
    flowInstance.value.setCenter(center.x, center.y, {
        duration: 200,
        zoom: 1
    });
}

function onConnect(params: Edge | Connection) {
    const edge = params as Edge;

    const sourceNodeId = edge.source;
    const sourceOptionId = edge.sourceHandle;
    const targetNodeId = edge.target;
    if (!sourceOptionId) return;

    useProjectsStore().addEdge(project.value!.id, selectedScene.value!.id, sourceNodeId, sourceOptionId, targetNodeId);
}
</script>

<style lang="scss" scoped>
.page--project {
    position: relative;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
}
</style>

<style lang="scss">
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
