<template>
    <div class="input-group">
        <div class="prepend" :class="{ 'is-slot-empty': isSlotEmpty }">
            <slot></slot>
        </div>
        <input
            v-bind="attrs"
            :value="modelValue"
            @input="onInput"
            @keydown.enter="onPressEnterKey"
            ref="input"
            autocomplete="off"
            @focus="showClearButton = true"
            @blur="onBlur"
            :class="{ 'show-clear-button': showClearButton && modelValue.length > 0 }"
        />
        <button
            class="clear"
            @mousedown="onClickClear"
            :class="{ show: showClearButton && modelValue.length > 0 }"
            tabindex="-1"
        >
            <i class="fas fa-times-circle"></i>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, useAttrs, useSlots } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const input = ref<HTMLInputElement | null>(null);

const showClearButton = ref(false);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const attrs: Record<string, unknown> = useAttrs();
const slots: Record<string, unknown> = useSlots();

function onBlur() {
    // Wait for the next frame to hide the clear button
    // This is a workaround for the issue where the button is hidden immediately after clicking it (iOS)
    requestAnimationFrame(() => {
        showClearButton.value = false;
    });
}

const isSlotEmpty = computed(() => {
    //@ts-ignore
    const defaultSlot = slots.default?.();
    const children = defaultSlot?.filter((v: any) => v.type !== Comment && v.type !== Text) ?? [];
    if (children.length === 0) return true;
    const firstChild = children[0];
    return firstChild?.children?.length === 0;
});

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}

function onClickClear() {
    // Focus the input before clearing because on iOS the input will lose focus
    // and the cursor will be removed when the input is cleared
    emit('update:modelValue', '');
    requestAnimationFrame(() => {
        if (input.value) input.value.focus();
    });
}

function onPressEnterKey() {
    if (input.value) input.value.blur();
}
</script>

<style scoped lang="scss">
.input-group {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 5px;
    height: 3.2rem;
    width: 100%;
    min-height: 3.2rem;
    gap: 0.4rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    padding-right: 0.8rem;
    outline: none;
    overflow: hidden;

    &:focus-within {
        outline: 2px solid var(--color-primary-alt);
        outline-offset: 0.2rem;
    }

    > .prepend {
        display: flex;
        flex-shrink: 0;
        gap: 1rem;
        align-items: center;
        padding: 0 1.2rem;
        background-color: var(--color-surface);
        margin-right: 0.6rem;
        height: 100%;
        border-right: 1px solid var(--color-surface-alt);
        white-space: nowrap;
    }

    .is-slot-empty {
        padding: 0;
        border: none;
        background: none;
    }

    > input {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: transparent;

        &:focus {
            outline: none;
        }
        &::placeholder {
            opacity: 0.5;
            font-style: italic;
        }
    }

    > button.clear {
        background: transparent;
        border: none;
        color: var(--color-primary);
        cursor: pointer;
        font-size: 1.2rem;
        width: 2rem;
        height: 100%;
        display: none;

        &.show {
            display: unset;
        }
    }
}
</style>
