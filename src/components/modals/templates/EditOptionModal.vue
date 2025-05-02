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
                <section>
                    <!-- Condition -->
                    <p class="with-inline-comboboxes">
                        {{ t('Modals.Edit-option.condition-description-1') }}
                        <ComboBox
                            v-model="address"
                            :options="addressList"
                            :placeholder="t('Modals.Edit-option.address-placeholder')"
                        >
                            {{ t('Modals.Edit-option.address') }}
                        </ComboBox>
                        {{ t('Modals.Edit-option.condition-description-2') }}
                        <ComboBox
                            v-model="command"
                            :options="commandList"
                            :placeholder="t('Modals.Edit-option.command-placeholder')"
                        ></ComboBox>
                    </p>
                </section>
                <Card>
                    <!-- Choose target -->
                    <div class="flex spread full-width">
                        <div>
                            <h3>{{ t('Modals.Edit-option.Target.title') }}</h3>
                            <p v-html="t('Modals.Edit-option.Target.description', { name: targetName as string })"></p>
                        </div>
                        <Button>
                            <span> {{ t('Modals.Edit-option.Target.unlink') }}</span>
                        </Button>
                    </div>
                </Card>
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
import DALI_COMMANDS from '@/assets/data/dali-commands.json';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Card from '@/components/ui/Card.vue';
import ComboBox from '@/components/ui/ComboBox.vue';
import InputGroup from '@/components/ui/InputGroup.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed, ref, watch } from 'vue';

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

const address = ref(props.option.condition?.address);
const command = ref(props.option.condition?.command);

// When address or command changes, update the option
watch([address, command], () => {
    props.option.condition = {
        address: address.value,
        command: command.value
    };
});

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

function onClickRemoveOption() {
    projectStore.removeOption(props.projectId, props.sceneId, props.dialogueId, props.option.id);
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

section {
    > p.with-inline-comboboxes {
        display: flex;
        align-items: center;
        gap: 1.6rem;
        margin-bottom: 1.6rem;
        white-space: nowrap;
        width: 100%;
        > .combo-box {
            min-width: 12rem;
        }
    }
}
</style>
