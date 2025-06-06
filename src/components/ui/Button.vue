<template>
    <button
        class="btn"
        :class="{
            'btn--icon': icon,
            'btn--mini': mini,
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
    mini: Boolean,
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
    flex-shrink: 0;
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
        width: 3.2rem;
        height: 3.2rem;
        background-color: transparent;
        border: none;
        top: 0;
        justify-content: center;
        align-items: center;
    }
    .btn__shadow {
        background-color: transparent;
    }
}

// Mini
.btn.btn--mini {
    .btn__content {
        height: auto;
        width: auto;
        padding: 0.2rem;
    }
}

// Disabled
.btn--disabled {
    pointer-events: none;
    border-color: transparent;
    opacity: 0.8;

    .btn__content {
        border-color: transparent;
        background-color: none;
        * {
            opacity: 0.5;
        }
    }

    .btn__shadow {
        background-color: transparent;
    }
}
</style>
