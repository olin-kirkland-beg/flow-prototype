<template>
    <div class="input-group">
        <div class="prepend">
            <slot></slot>
        </div>
        <input v-bind="attrs" :value="modelValue" @input="onInput" />
    </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, useAttrs } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const attrs = useAttrs();

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
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
