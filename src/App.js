import './App.css';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { AiOutlineEdit } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    if (!newTitle || !newDescription) {
     toast.error("Please enter both title and description")
      return;
    }
    else {
    let newTodoItems = {
        title: newTitle,
        description: newDescription,
      };
      let updatedTodoArray = [...allTodos];
      updatedTodoArray.push(newTodoItems);
      setAllTodos(updatedTodoArray);
      localStorage.setItem("todolist", JSON.stringify(updatedTodoArray));
    }
    setNewTitle("");
    setNewDescription("");

  };

  const HandleDeletTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index,1);
  
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  };

  const HandleCompleteTodo = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredTodo = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedTodos = [...completedTodos];
    updatedCompletedTodos.push(filteredTodo);
    setCompletedTodos(updatedCompletedTodos);
    HandleDeletTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedTodos));
  };

  const handleCompletedTodo=(index=>{
    let reducedCompletedTodo=[...completedTodos];
    reducedCompletedTodo.splice(index,1);
    localStorage.setItem("completedTodos",JSON.stringify(reducedCompletedTodo));
    setCompletedTodos(reducedCompletedTodo);
  });

  const handleEditTodo = (index,item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
    
  };

  const handleUpdateTitle=(value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev, title:value}
    })
    
  }
  const handleUpdatedDescription=(value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev, description:value}
    })

  }

  const handleUpdatetodo=()=>{
    let newTodo = [...allTodos];
    newTodo[currentEdit]=currentEditedItem;
    setAllTodos(newTodo); 
    localStorage.setItem("todolist", JSON.stringify(newTodo)); 
    setCurrentEdit("")       

  }


  useEffect(()=>{
    let savedTodos = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    if(savedTodos){
      setAllTodos(savedTodos);
    }
    if (savedCompletedTodos) {
      setCompletedTodos(savedCompletedTodos);
    }
  },[]);

  return (
    <div className='flex flex-col items-center justify-center h-auto'>
      <ToastContainer position='top-center' autoClose={2000} />
      <h1 className='text-2xl text-center font-bold p-10 '>My TO DO LIST</h1>

      <div className='wrapper bg-[#353434] h-auto p-5 w-auto ml-auto rounded-sm mr-auto shadow-custom '>
        <div className='input flex items-center justify-center border-b-slate-800 border-b-2 pb-4 mb-7  '>
         <div className='p-4'>
          <div className='pb-2'>
          <label className='font-bold mb-3 p-7 text-xl'>Title</label>
          </div>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className='flex flex-col text-black items-start mr-2 p-2 outline-none w-[250px] focus:outline-blue-600 rounded-xl  ' type='text' placeholder="What's the task title"  />
         </div>
         <div className='wrapper bg-[#353434] p-7 w-auto ml-auto mr-auto max-h-[80vh] shadow-teal-900 '>
          <div className='pb-2'>
          <label className='font-bold mb-3 p-7 text-xl' >Description</label>
          </div>
          <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className='flex text-black flex-col items-start mr-7 p-2 outline-none w-[250px] focus:outline-blue-600 rounded-xl  ' type='text' placeholder="What's the task description" />
         </div>
         <div>
          <button onClick={handleAddTodo} type='button' className='primary bg-[rgb(0,230,122)] text-white border-none mt-6 p-3 w-24 cursor-pointer hover:bg-[rgb(4,196,106)]'>Add</button>
         </div>
        </div>
        <div className='mb-5'>
          <button onClick={() => setIsCompleteScreen(!isCompleteScreen)} className={`isCompleteScreen ${isCompleteScreen === false ?'active bg-[rgb(45,131,92)] text-white border-none p-3 w-24 cursor-pointer ' : 'bg-[rgb(79,107,94)] w-24 p-3 '}`}>To Do</button>
          <button onClick={() => setIsCompleteScreen(!isCompleteScreen)} className={`isCompleteScreen ${isCompleteScreen === true ?'active bg-[rgb(45,131,92)] text-white border-none p-3 w-24 cursor-pointer' : 'bg-[rgb(79,107,94)]  w-24 p-3 '}`}>Completed</button>
        </div>
        <div>
          {
           isCompleteScreen=== false && allTodos.map((item,index)=>
           currentEdit === index ? (
            <div key={index}
            className="bg-[#414040] p-3 flex flex-col "
            > 
              <input 
              className='border-1 text-black border-gray-200 p-3 m-2 rounded-sm '             
              onChange={(e)=>handleUpdateTitle(e.target.value)} placeholder='Updated Title'  />
              <textarea
               className='border-1 text-black border-gray-200 p-3 m-2 rounded-sm ' 
               placeholder='Updated Description'
               rows={4}
              onChange={(e)=>handleUpdatedDescription(e.target.value)}
               />
               <button onClick={handleUpdatetodo} type='button' className='primary bg-[rgb(0,230,122)] ml-auto mr-auto p-2 font-bold text-xl rounded-xl w-32  text-white border-none mt-6 p-3cursor-pointer hover:bg-[rgb(4,196,106)]'>Update</button>
            </div>
           ) :
            (
              <div key={index} className='flex  bg-slate-500 shadow-custom justify-between rounded-md'>
                <div className=' flex flex-col items-start justify-center p-6 pb-2 pt-5 mb-2'>
            <h1 className='text-2xl font-bold text-[rgb(0,230,122)]'>{item.title}</h1>
            <p className='text-xl text-[rgb(161,161,161)] mt-1 '>{item.description}</p>
          </div>
          <div className='text-3xl flex items-center cursor-pointer justify-center gap-4 mr-7  '>
          <RiDeleteBin6Line title='Delete?' className='text-[white] hover:text-red-600' onClick={()=>HandleDeletTodo(index)} />
          <FaCheck title='Complete?' onClick={()=>HandleCompleteTodo(index)} className='text-[rgb(0,230,122)] hover:text-red-600' />
            <AiOutlineEdit title='Edit?' className='text-[rgb(0,230,122)] hover:text-red-600' onClick={()=>handleEditTodo(index)} />
          </div> 
              </div>
            ))
          }
          </div>
          <div>
          {
           isCompleteScreen=== true && completedTodos.map((item,index)=>(
              <div key={index} className='flex  bg-slate-500 shadow-custom justify-between rounded-md'>
                <div className=' flex flex-col items-start justify-center p-6 pb-2 pt-5 mb-2'>
            <h1 className='text-2xl font-bold text-[rgb(0,230,122)]'>{item.title}</h1>
            <p className='text-xl text-[rgb(161,161,161)] mt-1 '>{item.description}</p>
            <p className='text-l text-[rgb(161,161,161)] mt-1 '>Completed on: <i>{item.completedOn}</i></p>
          </div>
          <div className='text-3xl flex items-center cursor-pointer justify-center gap-4 mr-7  '>
          <RiDeleteBin6Line className='text-[white]  hover:text-red-600' onClick={()=>handleCompletedTodo(index)} />         
          </div> 
              </div>
            ))
          }
          </div>
      </div>
    </div>
  );
}

export default App;
