import { FormControl, List, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos"
import { makeStyles } from "@material-ui/styles";

import styles from "./App.module.css"
import { db } from "./firebase";
import TaskItem from "./TaskItem";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
})

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("")
  const classes = useStyles();

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input})
    setInput("")
  }

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <br />
      <FormControl>
        <TextField
        className={classes.field}
        label="New task ?"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      <List className={classes.list}>
      {tasks.map((task) => (
        <TaskItem key={task.id} id={task.id} title={task.title} />
      ))}
      </List>
    </div>
  );
};

export default App;
