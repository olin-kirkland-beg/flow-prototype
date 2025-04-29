<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <h2>{{ t('Modals.Edit-option.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="edit-option">
                <!-- Choose condition -->
                <div>CHOOSE CONDITION</div>
                <!-- Choose target -->
                <div>CHOOSE TARGET</div>
                <div>
                    <Button @click="onClickRemoveOption">
                        <i class="fas fa-trash"></i>
                        <span>{{ t('Modals.Edit-option.delete') }}</span>
                    </Button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed } from 'vue';

const props = defineProps({
    option: {
        type: Object,
        required: true
    },
    dialogueId: {
        type: String,
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

const projectStore = useProjectsStore();

const targetName = computed(() => {
    if (!props.option.edge) return null;
    const targetDialogue = useProjectsStore().getDialogue(props.projectId, props.sceneId, props.option.edge.target);
    return targetDialogue ? targetDialogue.data.label : null;
});

function onClickRemoveOption() {
    projectStore.removeOption(props.projectId, props.sceneId, props.dialogueId, props.option.id);
    ModalController.close();
}
</script>

<style scoped lang="scss">
.edit-option {
    display: flex;
    max-width: 32rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}
</style>
