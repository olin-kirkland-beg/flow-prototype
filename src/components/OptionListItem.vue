<template>
    <li class="option-list-item">
        <p>{{ option.label }}</p>
        <div class="connected-node">
            <span v-if="option.edge">
                {{ t('Project.State-sidebar.connected-to') }}
                <Link @click="emit('selectDialogue', option.edge.target)">
                    {{ targetName }}
                </Link>
            </span>
            <span v-else>
                {{ t('Project.State-sidebar.not-connected') }}
            </span>
        </div>
        <Button @click="onClickEditOption">
            <i class="fas fa-edit"></i>
            <span>{{ t('Project.Option-card.edit-option') }}</span>
        </Button>
    </li>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed } from 'vue';
import EditOptionModal from './modals/templates/EditOptionModal.vue';

const props = defineProps({
    option: {
        type: Object,
        required: true
    },
    dialogue: {
        type: Object,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    sceneId: {
        type: String,
        required: true
    }
});

const emit = defineEmits<{
    (e: 'selectDialogue', id: string): void;
}>();

const targetName = computed(() => {
    if (!props.option.edge) return null;
    const targetDialogue = useProjectsStore().getDialogue(props.projectId, props.sceneId, props.option.edge.target);
    return targetDialogue ? targetDialogue.data.label : null;
});

function onClickEditOption() {
    ModalController.open(EditOptionModal, {
        projectId: props.projectId,
        sceneId: props.sceneId,
        dialogueId: props.dialogue.id,
        optionId: props.option.id,
        edge: props.option.edge
    });
}
</script>

<style scoped lang="scss">
.option-list-item {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1.2rem;
}
</style>
