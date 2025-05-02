<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <h2>{{ t('Modals.Edit-option.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="edit-option">
                <section>
                    <!-- Label -->
                    <InputGroup v-model="option.label" :placeholder="t('Modals.Edit-option.label-placeholder')">
                        {{ t('Modals.Edit-option.label') }}
                    </InputGroup>
                </section>
                <Card overflow>
                    <!-- Condition -->
                    <p class="with-inline-comboboxes">
                        {{ t('Modals.Edit-option.condition-description-1') }}
                        <ComboBox
                            v-model="option.condition!.address"
                            :options="addressList"
                            :placeholder="t('Modals.Edit-option.address-placeholder')"
                        >
                            {{ t('Modals.Edit-option.address') }}
                        </ComboBox>
                        {{ t('Modals.Edit-option.condition-description-2') }}
                        <ComboBox
                            v-model="option.condition!.command"
                            :options="commandList"
                            :placeholder="t('Modals.Edit-option.command-placeholder')"
                        ></ComboBox>
                    </p>
                </Card>
                <Card>
                    <!-- Choose target -->
                    <div class="flex spread full-width">
                        <div>
                            <h3>{{ t('Modals.Edit-option.Target.title') }}</h3>
                            <p
                                v-if="targetName"
                                v-html="t('Modals.Edit-option.Target.description', { name: targetName as string })"
                            ></p>
                            <p v-else>{{ t('Modals.Edit-option.Target.description-no-target') }}</p>
                        </div>
                        <Button @click="onClickUnlinkOption" :disabled="!targetName">
                            <span> {{ t('Modals.Edit-option.Target.unlink') }}</span>
                        </Button>
                    </div>
                </Card>
                <Card>
                    <div class="flex spread full-width">
                        <div>
                            <h3>{{ t('Modals.Edit-option.Delete.title') }}</h3>
                            <p>{{ t('Modals.Edit-option.Delete.description') }}</p>
                        </div>
                        <Button @click="onClickRemoveOption">
                            <i class="fas fa-trash"></i>
                            <span>{{ t('Modals.Edit-option.Delete.delete') }}</span>
                        </Button>
                    </div>
                </Card>
                <h4 class="ellipsis">{{ option.id }}</h4>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import DALI_COMMANDS from '@/assets/data/dali-commands.json';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Card from '@/components/ui/Card.vue';
import ComboBox from '@/components/ui/ComboBox.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed, ref } from 'vue';

const props = defineProps({
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
    },
    optionId: {
        type: String,
        required: true
    },
    edge: {
        type: Object,
        required: false
    }
});

const projectStore = useProjectsStore();
const project = projectStore.getProject(props.projectId);
const scene = projectStore.getScene(props.projectId, props.sceneId);
const dialogue = projectStore.getDialogue(props.projectId, props.sceneId, props.dialogueId);
const option = projectStore.getOption(props.projectId, props.sceneId, props.dialogueId, props.optionId)!;

const targetName = ref(determineTargetName());

const commandList = DALI_COMMANDS;

const addressList = computed(() => {
    // Get all the addresses from this project
    const project = projectStore.getProject(props.projectId);
    const allAddresses: { value: string; label: string }[] = [];
    project?.scenes.forEach((scene) => {
        scene.dialogues.forEach((dialogue) => {
            dialogue.data.options.forEach((option) => {
                if (
                    option.condition?.address &&
                    !allAddresses.some((addr) => addr.value === option.condition?.address)
                ) {
                    allAddresses.push({
                        value: option.condition.address,
                        label: option.condition.address
                    });
                }
            });
        });
    });

    return allAddresses;
});

function determineTargetName() {
    if (!props.edge) return null;
    const targetDialogue = useProjectsStore().getDialogue(props.projectId, props.sceneId, props.edge.target);
    return targetDialogue ? targetDialogue.data.label : null;
}

function onClickUnlinkOption() {
    projectStore.removeEdge(props.projectId, props.sceneId, props.edge?.id);
    targetName.value = null;
}

function onClickRemoveOption() {
    projectStore.removeOption(props.projectId, props.sceneId, props.dialogueId, props.optionId);
    ModalController.close();
}
</script>

<style scoped lang="scss">
.edit-option {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

p.with-inline-comboboxes {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    margin-bottom: 1.6rem;
    white-space: nowrap;
    width: 100%;
    > .combo-box {
        min-width: 12rem;
    }
    margin-bottom: 0;
}
</style>
