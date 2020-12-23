import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Exercise = props => {
    <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0,10)}</td>
        <td>
            <Link to={"/edit/"+props.exercise._id}>edit</Link>|<a href="#" onClick={()=>{props.deleteExercise(prop.exercise._id) }}>delete</a>
        </td>
    </tr>
}

export default class ExercisesList extends Component{
    constructor(props){
        super(props);
        this.deleteExercise = this.deleteExercise.bind(this);

        this.state={exercises:[]};
    
    }

    componentDidMount(){
        axios.get('http://localhost:5000/exercises/')
         .then(response => {
             this.setState({
                 esercisesn:response.data })
         })
         .catch((error)=>{
             console.log(error);
         })
    }

    deleteExercise(id){
        axios.delete('http://localhost:5000/exercise/'+id)
         .then(res => console.log(res.data));
        this.serState({
            esercises: this.state.exercises.filter(el =>el._id !==id)
        })
    }

    exerciseList()
    {
        return this.state.exercises.map(currentexercis =>{
            return <Exercise exercise={cuuurntexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
        })
    }

    render(){
        return(
            <div>
                <h3>Logged Exercises</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th> Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exercisesList()}
                    </tbody>
                </table>
            </div>
        )
    }
}