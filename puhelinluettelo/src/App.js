import logo from './logo.svg';
import './App.css';

import numberService from './services/numbers';

import { useState, useEffect } from 'react';

const Notification = ({message}) => {
  if(message === null) {
    return null;
  }

  return(
    <div className='notification'>
      {message}
    </div>
  )
}

const Error = ({message}) => {
  if(message === null) {
    return null;
  }

  return(
    <div className='error'>
      {message}
    </div>
  )
}

const Numbers = ({name, number, handleDelete}) => {
  return(
    <div>
        <p>{name} {number} <button onClick={handleDelete}>delete</button></p>
    </div>
  )
}

const FilterForm = ({inputValue, onChangeValue}) => {
  return(
    <div>
      filter shown with <input value={inputValue} onChange={onChangeValue} />
    </div>
  )
}

const AddingForm = ({nameValue, nameOnChange, numberValue, numberOnChange,  onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>name <input value={nameValue} onChange={nameOnChange} /></div>
      <div>number <input value={numberValue} onChange={numberOnChange} /></div> 
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setNewFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() =>{
    numberService
      .getAll()
      .then(initialNumbers =>{
        setPersons(initialNumbers);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const names = persons.map(person => person.name);
    if(names.includes(newName)){
      if(window.confirm(`${newName} is already added to the phonebook. Do you want to replace old number with the new one?`)){
        const person = persons.find(p => p.name === newName);
        const changedPerson = {...person, number: newNumber}
        console.log(person);
        console.log(changedPerson);
        numberService
          .update(person.id, changedPerson)
          .then(response =>{
            setPersons(persons.map(p => p.name !== person.name ? p : response));
            setNotification(`Changed ${newName}`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
    } else { 
      const personObject = {
        name: newName,
        number: newNumber
      }
      numberService
        .create(personObject)
        .then(returnedPerson =>{
          setPersons(persons.concat(returnedPerson));
          setNotification(`Added ${newName}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
    setNewName('');
    setNewNumber('');
  }

  const handleDeleteOf = (name) =>{
    const person = persons.find(p => p.name === name);
    // const newPersons = persons.filter(p => p !== person);
    if(window.confirm(`Do you really want to delete ${person.name}`)){
      numberService
      .remove(person.id)
      .then(response =>{
        setPersons(persons.filter(p => p !== person));
        setNotification(`Removed ${person.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
      }
      )
      .catch(error => {
        setError(`person ${person.name} was already deleted`);
        setTimeout(() => {
          setError(null);
        }, 5000);
      })
      
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    const filterVal = event.target.value
    const allNamesList = persons;
    const filteredNames = [];
    console.log('filter', filter)
    if(filterVal === '') {
      setPersons(allNamesList);
    } else {
      persons.forEach(person =>
        {if(person.name.includes(filterVal)){
          console.log('person', person)
          filteredNames.push(person);
        }  
      } 
      )
      setPersons(filteredNames);
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={error} />
      <FilterForm 
        inputValue={filter} 
        onChangeValue={handleFilterChange} 
      />
      <AddingForm 
        onSubmit={addPerson} 
        nameValue={newName} 
        nameOnChange={handleNameChange} 
        numberValue={newNumber} 
        numberOnChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      {persons.map(person =>
        <Numbers 
          key={person.name} 
          name={person.name} 
          number={person.number} 
          handleDelete={() => handleDeleteOf(person.name)}  
        />
      )}
      {/* <Numbers nameList={persons} handleDelete={() => handleDeleteOf(person.name)} /> */}
    </div>
  )

}

export default App
