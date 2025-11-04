import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// 1. Import Ant Design components
import { Button, List, Typography, Space, Checkbox, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const client = generateClient<Schema>();
const { Title } = Typography; // Destructure Title for the h1

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // READ: Observes the query and updates the state
  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
      error: (error) => console.error("Error observing Todos:", error),
    });
    return () => sub.unsubscribe(); // Cleanup subscription
  }, []);

  // CREATE
  function createTodo() {
    const content = window.prompt("Enter new Todo content:");
    if (content) {
      client.models.Todo.create({ content });
      message.success('Todo created!');
    }
  }

  // DELETE
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
    message.info('Todo deleted!');
  }
  
  // UPDATE: Adding a toggle for completion (since the schema has no 'completed' field, we'll assume one for demonstration if you update your schema)
  // If your schema includes a 'completed: Boolean' field:
  /*
  function toggleTodo(todo: Schema["Todo"]["type"]) {
    client.models.Todo.update({
      id: todo.id,
      completed: !todo.completed,
    });
  }
  */

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {/* 2. Use Ant Design Typography for the Title */}
      <Title level={1}>To-Do List</Title>

      {/* 3. Use Ant Design Button for Create */}
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={createTodo} 
        style={{ marginBottom: '20px' }}
      >
        New Todo
      </Button>

      {/* 4. Use Ant Design List for displaying todos (READ) */}
      <List
        bordered
        dataSource={todos}
        locale={{ emptyText: "No Todos yet. Click 'New Todo' to start!" }}
        renderItem={(todo) => (
          <List.Item
            key={todo.id}
            // Actions placed on the right side of the list item
            actions={[
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => deleteTodo(todo.id)}
                size="small"
              >
                Delete
              </Button>
            ]}
          >
            <Space>
              {/* If you add a 'completed' field, you can uncomment this checkbox: */}
              {/* <Checkbox 
                 checked={todo.completed} 
                 onChange={() => toggleTodo(todo)} 
              /> */}
              {/* Display the content */}
              <Typography.Text style={{ /* textDecoration: todo.completed ? 'line-through' : 'none' */ }}>
                 {todo.content}
              </Typography.Text>
            </Space>
          </List.Item>
        )}
      />

      {/* Footer Info */}
      <div style={{ marginTop: '40px', textAlign: 'center', color: '#888' }}>
        App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;