<template>
    <g>
        <path
            class="vue-flow__connection animated"
            fill="none"
            stroke="var(--color-on-surface)"
            :stroke-width="2"
            :d="`M ${sourceX} ${sourceY} C ${sourceX} ${targetY}, ${targetX} ${sourceY}, ${targetX} ${targetY}`"
        />
    </g>
</template>

<script setup lang="ts">
const props = defineProps({
    sourceX: {
        type: Number,
        required: true
    },
    sourceY: {
        type: Number,
        required: true
    },
    targetX: {
        type: Number,
        required: true
    },
    targetY: {
        type: Number,
        required: true
    }
});
</script>
