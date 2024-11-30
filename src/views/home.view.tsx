import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Container, Typography, Box, Select, MenuItem, Paper, IconButton } from '@mui/material';
import { BiPencil, BiPlus, BiTrash } from 'react-icons/bi';
import { Task, TaskModel } from '../models/task.model';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const HomeView = ({ taskModel }: { taskModel: TaskModel }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const allTasks = await taskModel.getTasks();
    setTasks(allTasks);
  };


  const handleAddOrEditTask = async () => {
    if (editingTask) {
      await taskModel.updateTask({ ...editingTask, name: taskName, description: taskDescription });
    } else {
      await taskModel.addTask({ name: taskName, description: taskDescription, status: 'created' });
    }
    setDialogOpen(false);
    setTaskName('');
    setTaskDescription('');
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await taskModel.deleteTask(id);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Paper sx={{ padding: '24px'}}>
        <Typography variant="h4" gutterBottom>
          Todo List
        </Typography>

        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '24px 0px' }}>
          <TextField
            label="Search Tasks"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />

          <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<BiPlus />}  sx={{ width: '150px' }}>
            Add Task
          </Button>
        </Box>

        

        <Box>
          {filteredTasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                '&:last-child': {
                  borderBottom: '1px solid transparent'
                }
              }}
            >
              <Box>
                <Typography variant="h6">{task.name}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: '12px'}}>
                <Select
                  value={task.status}
                  onChange={async (e) => {
                    await taskModel.updateTask({ ...task, status: e.target.value as Task['status'] });
                    fetchTasks();
                  }}
                  size="small"
                  sx={{ width: '150px' }}
                >
                  <MenuItem value="created">Created</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>

                <Box sx={{ display: 'flex', gap: '12px'}}>
                  <IconButton
                    onClick={() => {
                      setEditingTask(task);
                      setTaskName(task.name);
                      setTaskDescription(task.description);
                      setDialogOpen(true);
                    }}
                  >
                    <BiPencil />
                  </IconButton>
                  <IconButton  onClick={() => handleDeleteTask(task.id!)}>
                    <BiTrash />
                  </IconButton>
                </Box>
              </Box>
              
            </Box>
          ))}
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Task Name"
              fullWidth
              margin="normal"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <TextField
              label="Task Description"
              fullWidth
              margin="normal"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddOrEditTask}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Paper>
      
    </Container>
  );
};

