<template>
    <button
        class="btn"
        :class="{
            'btn--icon': icon,
            'btn--primary': primary,
            'btn--danger': danger,
            'btn--disabled': disabled,
            'full-width': fullWidth
        }"
        :disabled="disabled"
    >
        <div class="btn__shadow"></div>
        <div class="btn__content"><slot></slot></div>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    icon: Boolean,
    primary: Boolean,
    danger: Boolean,
    disabled: Boolean,
    fullWidth: Boolean
});
</script>

<style lang="scss" scoped>
button {
    position: relative;
    background-color: transparent;
}

.full-width > .btn__content {
    justify-content: center;
}

.btn__content {
    position: relative;
    top: -0.2rem;
    display: flex;
    gap: 0.8rem;
    align-items: center;
    height: 3.2rem;
    padding: 0 1.2rem;
    border-radius: 5px;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:active,
    &:focus {
        transition: unset;
        filter: brightness(0.95);
        top: 0;
    }
}

.btn__shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--color-surface-alt);
}

// Primary button
.btn--primary {
    .btn__content {
        background-color: var(--color-primary);
        border: 1px solid var(--color-primary-alt);
        * {
            color: var(--color-background);
        }
    }
    .btn__shadow {
        background-color: var(--color-primary-alt);
    }
}

// Danger button
.btn--danger {
    .btn__content {
        background-color: var(--color-danger);
        border: 1px solid var(--color-danger-alt);
        * {
            color: var(--color-background);
        }
    }
    .btn__shadow {
        background-color: var(--color-danger-alt);
    }
}

// Icon-only button
.btn.btn--icon {
    .btn__content {
        background-color: transparent;
        border: none;
        top: 0;
    }
    .btn__shadow {
        background-color: transparent;
    }
}

// Disabled
.btn--disabled {
    opacity: 0.5;
    pointer-events: none;
    border: none;
}
</style>
