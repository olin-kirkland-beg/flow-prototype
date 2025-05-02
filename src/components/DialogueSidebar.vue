<template>
    <!-- Dialogue Panel -->
    <Transition name="sidebar-transition">
        <Panel class="sidebar sidebar--right" v-if="selectedDialogue">
            <div class="sidebar__header">
                <h2>{{ t('Project.State-sidebar.title') }}</h2>
                <div>
                    <Button @click="onClickPanToDialogue" icon>
                        <i class="fas fa-crosshairs"></i>
                    </Button>
                    <Button @click="onClickCloseDialogue" icon>
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
            </div>

            <InputGroup v-model="selectedDialogue.data.label" :placeholder="t('Project.State-sidebar.name')">
                <span>{{ t('Project.State-sidebar.name') }}</span>
            </InputGroup>

            <!-- Add Option button -->
            <Button @click="onClickAddOption" full-width>
                <i class="fas fa-plus"></i>
                <span>{{ t('Project.State-sidebar.add-option') }}</span>
            </Button>

            <!-- List of options -->
            <List class="options">
                <li v-if="options.length === 0">
                    <em> {{ t('Project.State-sidebar.no-options') }} </em>
                </li>

                <OptionListItem
                    v-for="option in options"
                    :key="option.id"
                    :option="option"
                    :dialogue="selectedDialogue"
                    :projectId="project.id"
                    :sceneId="selectedScene.id"
                    @selectDialogue="emit('selectDialogue', $event)"
                />
            </List>

            <!-- Remove Dialogue button -->
            <Button @click="onClickRemoveSelectedDialogue" full-width>
                <i class="fas fa-trash"></i>
                <span>{{ t('Project.State-sidebar.remove-state') }}</span>
            </Button>
        </Panel>
    </Transition>
</template>

<script setup lang="ts">
import Dialogue, { DialogueOption } from '@/dialogue';
import { t } from '@/i18n/locale';
import Project from '@/project';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { getUniqueName } from '@/utils/naming-util';
import { Edge } from '@vue-flow/core';
import { v4 as uuid } from 'uuid';
import { computed } from 'vue';
import OptionListItem from './OptionListItem.vue';
import InputGroup from './ui/InputGroup.vue';

const props = defineProps<{
    project: Project;
    selectedScene: Scene;
    selectedDialogue: Dialogue | null;
}>();

const emit = defineEmits<{
    (e: 'panToDialogue', id: string): void;
    (e: 'selectDialogue', id: string): void;
    (e: 'deselectDialogue'): void;
}>();

const projectStore = useProjectsStore();

const options = computed(() => {
    const optionsWithEdges: (DialogueOption & { edge: Edge | null })[] = [];
    // optionsWithEdges contains the options from props.selectedDialogue.data.options
    // and incorporates the associated outgoing edges
    props.selectedDialogue?.data.options.forEach((option) => {
        const optionWithEdge: DialogueOption & { edge: Edge | null } = {
            ...option,
            edge: null
        };
        // Find the edge associated with this option
        // and add it to the optionWithEdge object
        props.selectedScene.edges.forEach((edge) => {
            if (edge.sourceHandle === option.id) optionWithEdge.edge = edge;
        });

        optionsWithEdges.push(optionWithEdge);
    });

    return optionsWithEdges;
});

function onClickCloseDialogue() {
    emit('deselectDialogue');
}

function onClickPanToDialogue() {
    if (!props.selectedDialogue) return;
    emit('panToDialogue', props.selectedDialogue.id);
}

function onClickAddOption() {
    if (!props.selectedDialogue) return;
    const newOption: DialogueOption = {
        id: uuid(),
        label: getUniqueName(
            props.selectedDialogue.data.options.map((option) => option.label),
            t('Project.State-sidebar.new-option')
        ),
        condition: {
            address: '',
            command: ''
        }
    };

    projectStore.addOption(props.project.id, props.selectedScene?.id, props.selectedDialogue.id, newOption);
}

function onClickRemoveSelectedDialogue() {
    if (!props.selectedDialogue) return;
    emit('deselectDialogue');
    projectStore.removeDialogue(props.project.id, props.selectedScene?.id, props.selectedDialogue.id);
}
</script>

<style scoped lang="scss">
.sidebar {
    z-index: 1;
    max-width: 32rem;
    flex: 1;
    overflow: hidden;
}

.sidebar__header {
    width: 100%;
    border-bottom: 1px solid var(--color-surface-alt);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;

    &:not(:last-child) {
        margin-bottom: 2.4rem;
    }
}

:deep(ul.options) {
    min-height: 40rem;
    flex: 1;

    > li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.8rem;
        cursor: unset;

        > span {
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
        }
    }
}

// Sidebar Transition
.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
    transition: all 0.2s ease;
}

.sidebar-transition-enter-from,
.sidebar-transition-leave-to {
    opacity: 0;
    transform: translateX(2rem);
}
</style>
