<template>
    <div class="combo-box">
        <InputGroup
            ref="inputGroupRef"
            v-bind="attrs"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="onInput"
            :modelValue="props.modelValue"
            @update:modelValue="onUpdateModelValue"
        >
            <slot></slot>
        </InputGroup>
        <Transition name="combo-box-transition">
            <List v-if="isFocused && matchingOptions.length">
                <li
                    v-for="option in matchingOptions"
                    :key="option.value"
                    @click="emit('update:modelValue', option.label)"
                >
                    <div class="full-width">
                        <span>{{ option.label }}</span>
                    </div>
                </li>
            </List>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    options: {
        type: Array as () => Array<{ label: string; value: any }>,
        default: () => []
    }
});

const attrs = useAttrs();
const matcher = ref(props.modelValue);
const inputGroupRef = ref();

const matchingOptions = computed(() => {
    const searchTerm = props.modelValue.toLowerCase();
    if (!searchTerm.length) return [...props.options];
    return props.options.filter((option) => option.label.toLowerCase().includes(searchTerm));
});

const isFocused = ref(false);
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
    matcher.value = target.value;
}

function onUpdateModelValue(value: string) {
    emit('update:modelValue', value);
}
</script>

<style scoped lang="scss">
.combo-box {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

ul {
    position: absolute;
    z-index: 1;
    top: calc(100% + 0.6rem);
    left: 0;
    box-shadow: var(--shadow-sm);
    width: 100%;
    max-height: 16rem;
    background: var(--color-background);
}

.combo-box-transition-enter-active {
    animation: slide-in 0.2s ease-out;
}

.combo-box-transition-leave-active {
    animation: slide-out 0.2s ease-out;
}

@keyframes slide-in {
    0% {
        transform: translateY(-5px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-out {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-5px);
        opacity: 0;
    }
}
</style>
