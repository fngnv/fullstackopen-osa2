const Header = (props) =>{
    console.log('Header props ', props);
  
    return(
      <div>
        <h2>{props.header}</h2>
      </div>
    )
  }
  
  const Part = (props) =>{
    return(
      <div>
        <p>{props.part} {props.exercises}</p>
      </div>
    )
  }
  
  const Content = ({name, exercises}) =>{
  
    return(
      <Part part={name} exercises={exercises} />
    )
  }
  
  const Total = ({total}) =>{
  
    return(
      <div>
        <p><b>Total {total}</b></p>
      </div>
    )
  }
  
  const Course = ({course}) =>{
     const exercisesList = course.parts.map(part => part.exercises);
    const initialValue = 0;
    const sum = exercisesList.reduce(
      (accumulator, currentvalue) => accumulator + currentvalue, initialValue
    );
    console.log(sum);
  
    return(
      <div>
        <Header header={course.name} />
        {course.parts.map(part =>
          <Content key={part.id} name={part.name} exercises={part.exercises} /> 
        )}
        <Total total={sum} />
      </div>
    ) 
  }

  export default Course