import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await taskAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(id);
      setSuccess('Task deleted successfully');
      fetchTasks();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    fetchStats();
    handleCloseModal();
    setSuccess('Task saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const getStatusCount = (status) => {
    if (!stats?.byStatus) return 0;
    const stat = stats.byStatus.find(s => s._id === status);
    return stat?.count || 0;
  };

  return (
    <div className="container">
      <div className="dashboard">
        <h2>Dashboard</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{stats?.totalTasks || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{getStatusCount('pending')}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{getStatusCount('in-progress')}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{getStatusCount('completed')}</p>
          </div>
        </div>

        {/* Tasks Header */}
        <div className="tasks-header">
          <h3>My Tasks</h3>
          <div className="filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button onClick={() => setShowModal(true)} className="btn btn-success">
              + New Task
            </button>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <div>
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta">
                      <span className={`status-badge status-${task.status}`}>
                        {task.status}
                      </span>
                      <span className={`status-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-actions">
                  <button 
                    onClick={() => handleEdit(task)} 
                    className="btn btn-secondary btn-small"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)} 
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showModal && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;
