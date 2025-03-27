import { Suspense } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskSort } from '@/components/tasks/TaskSort';
import { Card } from '@/components/display/Card';
import { Button } from '@/components/form/Button';
import { Modal } from '@/components/feedback/Modal';
import { useState } from 'react';

export default function TasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">任务管理</h1>
        <Button
          type="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          新建任务
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3">
          <TaskFilters />
        </div>
        <div>
          <TaskSort />
        </div>
      </div>

      <Card>
        <Suspense fallback={<div>加载中...</div>}>
          <TaskList />
        </Suspense>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新建任务"
      >
        <TaskForm
          onSubmit={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
} 