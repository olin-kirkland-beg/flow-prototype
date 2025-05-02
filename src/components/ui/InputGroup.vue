<template>
    <div class="input-group">
        <div class="prepend" :class="{ 'is-slot-empty': isSlotEmpty }">
            <slot></slot>
        </div>
        <input v-bind="attrs" :value="modelValue" @input="onInput" />
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, useAttrs, useSlots } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const attrs = useAttrs();
const slots = useSlots();

const isSlotEmpty = computed(() => {
    const defaultSlot = slots.default?.();
    const children = defaultSlot?.filter((v) => v.type !== Comment && v.type !== Text) ?? [];
    if (children.length === 0) return true;
    const firstChild = children[0];
    return firstChild?.children?.length === 0;
});

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}
</script>

<style scoped lang="scss">
.input-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 5px;
    overflow: hidden;
    height: 3.2rem;
    width: 100%;
    min-height: 3.2rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    padding-right: 0.8rem;

    outline: none;

    &:focus-within {
        outline: 2px solid var(--color-primary-alt);
        outline-offset: 0.2rem;
    }

    > .prepend {
        display: flex;
        gap: 0.8rem;
        align-items: center;
        padding: 0 1.2rem;
        background-color: var(--color-surface);
        margin-right: 0.6rem;
        height: 100%;
        border-right: 1px solid var(--color-surface-alt);
    }

    .is-slot-empty {
        padding: 0;
        border: none;
        background: none;
    }

    > input {
        height: 100%;
        background-color: transparent;
        &:focus {
            outline: none;
        }
        &::placeholder {
            opacity: 0.5;
            font-style: italic;
        }
        flex: 1;
    }
}
</style>
