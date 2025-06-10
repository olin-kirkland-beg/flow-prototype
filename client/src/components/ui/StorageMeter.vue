<template>
    <div class="storage-meter">
        <i class="muted fas fa-hdd"></i>
        <p class="percentage muted">{{ percentageText }}%</p>
        <div class="progress-bar">
            <div class="progress" :style="{ width: percentage + '%' }"></div>
        </div>
        <p class="muted">
            {{ bytesToReadable(props.usedBytes) }} /
            {{ bytesToReadable(props.maxBytes) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { bytesToReadable } from '@/utils/storage-util';
import { computed } from 'vue';

const props = defineProps({
    usedBytes: {
        type: Number,
        required: true
    },
    maxBytes: {
        type: Number,
        required: true
    }
});

const percentage = computed(() => {
    return (props.usedBytes / props.maxBytes) * 100;
});

const percentageText = computed(() => {
    if (percentage.value < 1) return '<1';
    return percentage.value.toFixed(2);
});
</script>

<style lang="scss" scoped>
.storage-meter {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: var(--color-on-surface);
    background-color: var(--color-surface-alt);
    border-radius: 99px;
    padding: 0.4rem 1.2rem;
    gap: 1.2em;

    p {
        font-size: 1.2rem;
    }

    .progress-bar {
        flex-grow: 1;
        height: 1rem;
        background-color: var(--color-surface);
        border-radius: 99px;
        overflow: hidden;
        position: relative;
        width: 8rem;

        .progress {
            height: 100%;
            min-width: 0.2rem;
            background-color: var(--color-primary);
        }
    }

    .percentage {
        margin-left: 0.5rem;
    }
}
</style>
