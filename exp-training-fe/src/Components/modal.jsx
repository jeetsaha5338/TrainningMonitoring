import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBCol,MDBModalBody, MDBModalHeader, MDBModalFooter ,MDBInput, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBRow } from 'mdbreact';
import AutocompletePage from './Autocomplete';
import FormsPage from './Forms'

class ModalPage extends Component {
state = {
  modal8: false,
  modal9: false
}

toggle = nr => () => {
  let modalNumber = 'modal' + nr
  this.setState({
    [modalNumber]: !this.state[modalNumber]
  });
}

render() {
  return (
    <MDBContainer>
      <MDBBtn color="info" onClick={this.toggle(8)}>Add</MDBBtn>
      <MDBModal isOpen={this.state.modal8} toggle={this.toggle(8)} fullHeight position="right">
        <MDBModalHeader toggle={this.toggle(8)}>Add Details</MDBModalHeader>
        <MDBModalBody>
        <MDBRow>
        <MDBCol md="8" className="mb-3">
        <label
                htmlFor="defaultFormRegisterNameEx"
                className="grey-text"
              >
                Topic
              </label>
              <input
                value={this.state.fname}
                name="fname"
                onChange={this.changeHandler}
                type="text"
                id="defaultFormRegisterNameEx"
                className="form-control"
                placeholder="Topic"
                required
              />
              </MDBCol>
              </MDBRow>
    <MDBRow>
    <MDBCol md="4" className="mb-3">
    <MDBDropdown>
      <MDBDropdownToggle caret color="primary">
        Select Category
      </MDBDropdownToggle>
      <MDBDropdownMenu basic>
        {/* <MDBDropdownItem>Action</MDBDropdownItem>
        <MDBDropdownItem>Another Action</MDBDropdownItem>
        <MDBDropdownItem>Something else here</MDBDropdownItem>
        <MDBDropdownItem divider />
        <MDBDropdownItem>Separated link</MDBDropdownItem> */}
      </MDBDropdownMenu>
    </MDBDropdown>
    </MDBCol>
    
    <MDBCol md="4" className="mb-3">

    <MDBDropdown>
       
      <MDBDropdownToggle caret color="primary">
        Select Duration
      </MDBDropdownToggle>
      <MDBDropdownMenu basic>
        <MDBDropdownItem>Action</MDBDropdownItem>
        {/* <MDBDropdownItem>Another Action</MDBDropdownItem>
        <MDBDropdownItem>Something else here</MDBDropdownItem>
        <MDBDropdownItem divider />
        <MDBDropdownItem>Separated link</MDBDropdownItem> */}
      </MDBDropdownMenu>
    </MDBDropdown>
            </MDBCol>
            </MDBRow>
  
    <FormsPage />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle(8)}>Close</MDBBtn>
          <MDBBtn color="primary">Add/Update</MDBBtn>
          <MDBBtn color="primary">Delete</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
     </MDBContainer>
    );
  }
}

export default ModalPage;