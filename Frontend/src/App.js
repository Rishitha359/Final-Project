import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Pages/Login';
import Home from './Pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import TrainingDetails from './Components/TrainingDetails';
import AddTrainings from './Pages/AddTrainings';
import AddEmployee from './Pages/AddEmployee';
import AdminTraining from './Components/AdminTraining'
import ViewScore from './Pages/ViewScore';
import AdminScore from './Pages/AdminScore'
import AdminScores from './Pages/AdminScores';
import ViewEmployees from './Pages/ViewEmployees';

function App() {

  const auth = localStorage.getItem('token');

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/home' element={auth? <Home/> : <Login/>}></Route>
    <Route path='/viewTraining' element={auth? <TrainingDetails/> : <Login/>}></Route>
    <Route path='/addTraining' element={auth? <AddTrainings/> : <Login/>}></Route>
    <Route path='/addEmployee' element={auth? <AddEmployee/> : <Login/>}></Route>
    <Route path='/allTraining' element={auth? <AdminTraining/> : <Login/>}></Route>
    <Route path='/viewScore/:id' element={auth? <ViewScore/> : <Login/>}></Route>
    <Route path='/viewScores/:id' element={auth? <AdminScore/> : <Login/>}></Route>
    <Route path='/viewScore' element={auth? <AdminScores/> : <Login/>}></Route>
    <Route path='/viewEmployee' element={auth? <ViewEmployees/> : <Login/>}></Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;
