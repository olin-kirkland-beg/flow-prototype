<template>
    <ModalFrame overflow>
        <template v-slot:header>
            <ModalHeader close-button>
                <h2>{{ t('Modals.Actions.title') }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="actions">
                <section>
                    <!-- Instructions -->
                    <Card overflow>
                        <p v-html="t('Modals.Actions.instructions')"></p>
                        <div class="flex">
                            <div class="action-inputs">
                                <div class="combo-box-details combo-box-details--address">
                                    <ComboBox
                                        v-model="action.address"
                                        :options="addressList"
                                        :placeholder="t('Modals.Edit-option.Condition.address-placeholder')"
                                    >
                                        {{ t('Modals.Edit-option.Condition.address') }}
                                    </ComboBox>
                                </div>
                                <div class="combo-box-details combo-box-details--command">
                                    <ComboBox
                                        v-model="action.command"
                                        :options="commandList"
                                        :placeholder="t('Modals.Edit-option.Condition.command-placeholder')"
                                    >
                                        {{ t('Modals.Edit-option.Condition.command') }}
                                    </ComboBox>
                                    <Transition name="shelf-transition" mode="out-in">
                                        <div
                                            class="details"
                                            v-if="
                                                getCommandReadableName(action.command) &&
                                                getCommandReadableDescription(action.command)
                                            "
                                        >
                                            <i class="fas fa-info-circle"></i>
                                            <div>
                                                <p>
                                                    <strong>{{
                                                        t(getCommandReadableName(action.command) || '')
                                                    }}</strong>
                                                </p>
                                                <p>{{ t(getCommandReadableDescription(action.command) || '') }}</p>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                            <Button @click="onClickAddAction" :disabled="!action.address || !action.command">
                                <i class="fas fa-plus"></i>
                                <span>{{ t('Modals.Actions.add-action') }}</span>
                            </Button>
                        </div>
                    </Card>
                </section>
                <Card class="list" ref="listEl">
                    <div
                        class="action"
                        v-for="(action, index) in dialogue.data.actions"
                        :key="index"
                        v-if="dialogue.data.actions.length"
                    >
                        <pre>{{ JSON.stringify(action) }}</pre>
                        <Button @click="onClickRemoveAction(index)" icon mini>
                            <i class="fas fa-trash"></i>
                        </Button>
                    </div>
                    <div class="action empty" v-else>
                        <em>{{ t('Modals.Actions.no-actions') }}</em>
                    </div>
                </Card>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import COMMANDS from '@/assets/data/commands.json';
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import Card from '@/components/ui/Card.vue';
import ComboBox from '@/components/ui/ComboBox.vue';
import { t } from '@/i18n/locale';
import { useProjectsStore } from '@/store/projects-store';
import { computed, ref } from 'vue';

const props = defineProps({
    projectId: {
        type: String,
        required: true
    },
    dialogue: {
        type: Object,
        required: true
    }
});

const projectStore = useProjectsStore();
const listEl = ref<HTMLElement | null>();

const action = ref({
    address: '',
    command: ''
});

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
            dialogue.data.actions.forEach((action) => {
                if (action.address && !allAddresses.some((address) => address.value === action.address)) {
                    allAddresses.push({
                        value: action.address,
                        label: action.address
                    });
                }
            });
        });
    });

    return allAddresses;
});

const commandList = COMMANDS.map((command) => ({
    value: command.value,
    label: command.value
}));

function getCommandReadableName(commandValue: string) {
    const commandLabel = COMMANDS.find((cmd) => cmd.value === commandValue)?.label;
    if (!commandLabel) return null;
    return `DALI-commands-readable.${commandLabel}.label`;
}

function getCommandReadableDescription(commandValue: string) {
    const commandDescription = COMMANDS.find((cmd) => cmd.value === commandValue)?.label;
    if (!commandDescription) return null;
    return `DALI-commands-readable.${commandDescription}.description`;
}

function onClickAddAction() {
    // Add a new action to the dialogue
    props.dialogue.data.actions.push({ ...action.value });

    // Reset the action input
    action.value = {
        address: '',
        command: ''
    };

    // TODO: Scroll the .list to the bottom
    // console.log('Scrolling to bottom');
    if (listEl.value) {
        // console.log(listEl.value);
        // console.log('Scroll height:', listEl.value.scrollHeight);
        // console.log('Client height:', listEl.value.clientHeight);
        // listEl.value.scrollTop = listEl.value.scrollHeight;
        // Ensure the scroll is smooth
    }
}

function onClickRemoveAction(index: number) {
    // Remove the action at the specified index
    props.dialogue.data.actions.splice(index, 1);
}
</script>

<style scoped lang="scss">
.actions {
    display: flex;
    max-width: 72rem;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    height: 100%;
}

section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-start;
}

.card.list {
    gap: 0;
    height: 16rem;
    max-height: 16rem;
}

.action {
    width: 100%;
    display: flex;
    padding: 1rem;
    > pre {
        flex: 1;
    }
}

.action-inputs {
    display: flex;
    align-items: flex-start;
    gap: 1.6rem;
    white-space: nowrap;
    width: 100%;
    margin-bottom: 0;

    .combo-box-details {
        flex: 1;
        .details {
            overflow: hidden;
            display: flex;
            gap: 0.8rem;
            width: 100%;
            padding: 0.8rem;
            align-items: center;

            > i {
                font-size: 2rem;
            }
        }

        // &--address {
        // }

        // &--command {
        // }
    }
}

// Shelf Transition
.shelf-transition-enter-active,
.shelf-transition-leave-active {
    transition: all 0.2s ease;
    max-height: 10rem;
}

.shelf-transition-enter-from,
.shelf-transition-leave-to {
    max-height: 0;
}
</style>
