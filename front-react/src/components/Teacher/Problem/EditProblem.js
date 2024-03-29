import React, { Component } from "react";
import {Row, Col} from "react-bootstrap";
import axios from 'axios';
import {Button, FormGroup, ControlLabel, FormControl, HelpBlock} from "react-bootstrap";

const examples = problem => {
  const newInputs = problem.inputs.map((input, i) => {
    return {'type': input.type, 'value': input.input}
  });
}

const addProblem = problem => {
  fetch('http://localhost:8082/problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "problemTitle": problem.title,
        "problemStatement": problem.description,
        "example": {
          "input":{
            "type": problem.inputs[0].type,
            "value": problem.inputs[0].value
          },
          "result":{
            "type": problem.typeOutput,
            "value": problem.output
          }
        },
        "language": problem.language,
        "user":{
          "userId": 1
        }
      })
  })
    .catch(error => {
        console.error(error);
    });
 }

 const addUser = user => {
   fetch('http://localhost:8082/users', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         "userEmail": "prueba@prueba.cl",
         "userPassword": "password",
         "userType": 0
       })
   })
     .catch(error => {
         console.error(error);
     });
  }

class EditProblem extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      output: '',
      typeOutput: '',
      description: '',
      inputs: [],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8082/problems/'+this.props.match.params.id)
      .then(res => {
        const problem = res.data;
        console.log(problem);
        console.log(problem.problemExamples[0]);
        this.setState({
          output: problem.problemExamples[0].result.resultValue,
          typeOutput: problem.problemExamples[0].result.resultType,
          title: problem.problemTitle,
          description: problem.problemStatement,
          language: problem.language,
        });

        problem.problemExamples[0].exampleInputs.map((input, id)=> {
          this.setState({ inputs: this.state.inputs.concat([{ input: input.inputValue, type: input.inputType }]) });
        });
      })
  };

  getValidationState() {
    const length = this.state.title.length;
    if (length > 0) return 'success';
    else if  (length === 0) return 'error';
    return null;
  }

  Change = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleShareholderNameChange = (idx) => (evt) => {
    const newShareholders = this.state.inputs.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value,  };
    });

    this.setState({ inputs: newShareholders });
  }

  handleShareholderTypeChange = (idx) => (evt) => {
    const newShareholders = this.state.inputs.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value,  };
    });
    this.setState({ inputs: newShareholders });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    const { title, inputs } = this.state;
    // alert(`Incorporated: ${title} with ${inputs.length} inputs`);
    //addUser(this.state);
    console.log("adding problem");
    addProblem(this.state);
    console.log("problem added");
    console.log(this.state);
  }

  handleAddShareholder = () => {
    this.setState({ inputs: this.state.inputs.concat([{ input: '', type: 'String' }]) });
  }

  handleRemoveShareholder = (idx) => () => {
    this.setState({ inputs: this.state.inputs.filter((s, sidx) => idx !== sidx) });
  }

  render() {
    return (

      <div className="container">
      <h1 className="title">Editar</h1>
      <form className= "body" onSubmit={this.handleSubmit}>
      <div className="card">
          <h3 className="card-title">Formulario</h3>
            <div className="card-body">
                <Row className="show-grid">
                  <Col xs={10} md={12}>
                  <FormGroup
                      controlId="formBasicText"
                      validationState={this.getValidationState()}
                    >
                      <ControlLabel>Título del problema:</ControlLabel>
                      <FormControl
                        name = "title"
                        type="text"
                        value={this.state.title}
                        placeholder="Escribe el titulo del problema..."
                        onChange={e => this.Change(e)}
                      />
                      <FormControl.Feedback />
                      <HelpBlock>Un nombre coherente.</HelpBlock>
                    </FormGroup>
                  </Col>
                </Row>


                  <Row className="show-grid">
                    <Col xs={10} md={4}>
                      <ControlLabel>Entradas del problema:</ControlLabel>
                    </Col>
                    <Col xs={10} md={4}>
                      <ControlLabel>Tipo:</ControlLabel>
                    </Col>
                    <Col xs={10} md={4}>
                      <Button bsStyle="success" bsSize="xsmall" onClick={this.handleAddShareholder}>Agregar</Button>
                    </Col>
                  </Row>


                  {this.state.inputs.map((shareholder, idx) => (
                    <div className="shareholder">
                    <Row className="show-grid">
                      <Col xs={6} md={4}>
                      <FormControl
                        name = "input"
                        type= "text"
                        value={shareholder.input}
                        placeholder={`Entrada #${idx + 1}`}
                        onChange={this.handleShareholderNameChange(idx)}
                      />
                      <FormControl.Feedback />
                      </Col>
                      <Col xs={6} md={2}>
                         <FormControl
                         componentClass="select"
                         placeholder="select"
                         name="type"
                         value={shareholder.type}
                         onChange={this.handleShareholderTypeChange(idx)}>
                           <option value="String">String</option>
                           <option value="Integer">Entero</option>
                         </FormControl>
                      </Col>
                      <Col xs={6} md={2}>
                      </Col>
                      <Col xsHidden md={4}>
                      <Button bsStyle="danger" bsSize="xsmall" onClick={this.handleRemoveShareholder(idx)} >Eliminar</Button>
                      </Col>
                    </Row>
                    </div>
                  ))}
                  <br />

                  <Row className="show-grid">
                    <Col xs={6} md={4}>
                    <ControlLabel>Salida del problema:</ControlLabel>
                    </Col>
                    <Col xs={6} md={6}>
                    <ControlLabel>Tipo:</ControlLabel>
                    </Col>
                  </Row>

                  <Row className="show-grid">
                    <Col xs={6} md={4}>
                      <FormControl
                        name ="output"
                        type="text"
                        value={this.state.output}
                        placeholder="Escribe la salida del problema..."
                        onChange={e => this.Change(e)}
                      />
                      <FormControl.Feedback />
                      <HelpBlock>Una salida coherente plis :D</HelpBlock>
                    </Col>
                    <Col xs={6} md={2}>
                        <FormControl
                        componentClass="select"
                        placeholder="select"
                        name="typeOutput"
                        value={this.state.typeOutput}
                        onChange={e => this.Change(e)}>
                          <option value="String">String</option>
                          <option value="Integer">Entero</option>
                        </FormControl>
                    </Col>
                  </Row>

                  <br />
                  <FormGroup
                      controlId="formBasicText"
                      validationState={this.getValidationState()}
                    >
                      <ControlLabel>Descripción del problema:</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        name = "description"
                        type="text"
                        value={this.state.description}
                        placeholder="Descripcion del problema..."
                        onChange={e => this.Change(e)}
                      />
                      <FormControl.Feedback />
                      <HelpBlock>Una descripcion coherente</HelpBlock>
                    </FormGroup>
                  <br />
                  <Button type="submit" onClick={e => this.handleSubmit(e)}>Guardar</Button>

                </div>
              </div>
      </form>
    </div>
    )
  }
}

export default EditProblem;
