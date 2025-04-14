<template>
    <Card>
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        <div class="flex flex-wrap">
            <Badge color="var(--color-surface-alt)" :useLightText="true">
                <span
                    >Created
                    {{ new Date(project.createdAt).toLocaleDateString() }}
                </span>
            </Badge>
            <Badge color="var(--color-surface-alt)" :useLightText="true">
                <span
                    >Modified
                    {{ new Date(project.updatedAt).toLocaleDateString() }}</span
                >
            </Badge>
        </div>
        <Button @click="onClickEditProject">
            <i class="fas fa-edit"></i>
            <span>Edit</span>
        </Button>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { PageName, router } from '@/router';
import Badge from './ui/Badge.vue';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

function onClickEditProject() {
    // Redirect to the project page with the project ID
    router.push({
        name: PageName.PROJECT,
        params: { id: props.project.id }
    });
}
</script>

<style scoped lang="scss"></style>
