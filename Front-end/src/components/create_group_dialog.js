import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createGroupAction } from "../actions/create_group_action";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const styles = theme => ({
  radioGroup: {
    width: "auto",
    height: "auto",
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row"
  },
  section: {
    marginTop: theme.spacing.unit * 2
  }
});

const GROUP_NAME = "group name";
const GROUP_DESCRIPTION = "group description";
const GROUP_MEMBERS = "group members";

class CreateGroupDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group_name: "",
      group_description: "",
      group_members: ""
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the create group response was received.
    if (this.props.createGroup && this.props.createGroup != prevProps.createGroup) {
      console.log("Create Group Response : " + JSON.stringify(this.props.createGroup));
      //TODO Show error if create groups failed based on responsecode.
      this.props.dismissDialog();
    }
  }

  handleTextFieldChange = (fieldId, event) => {
    // console.log(fieldId);
    // console.log(event.target.value);
    switch (fieldId) {
      case GROUP_NAME:
        this.setState({ group_name: event.target.value });
        break;
      case GROUP_DESCRIPTION:
        this.setState({ group_description: event.target.value });
        break;
      case GROUP_MEMBERS:
        this.setState({ group_members: event.target.value });
        break;
    }
  };

  handleClose = () => {
    // this.myDebugInfo();

    this.props.dismissDialog();
  };

  handleSubmit = () => {
    // this.myDebugInfo();

    this.props.createGroupAction(
      this.state.group_name,
      this.state.group_members,
      this.state.group_description,
      this.props.authentication.token
    );
    this.clearState();
  };

  clearState = () => {
    this.setState({
      group_name: "",
      group_description: "",
      group_members: ""
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          scroll="body" // "paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Create a New Group</DialogTitle>

          <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
            <DialogContent>
              <TextValidator
                name="group name"
                label="Group Name"
                value={this.state.group_name}
                validators={["required"]}
                errorMessages={["This field is required"]}
                variant="outlined"
                margin="normal"
                onChange={this.handleTextFieldChange.bind(this, GROUP_NAME)}
                fullWidth
              />

              <TextValidator
                name="description"
                validators={["required"]}
                errorMessages={["This field is required"]}
                label="Group Description"
                placeholder="Placeholder"
                value={this.state.group_description}
                margin="normal"
                variant="outlined"
                onChange={this.handleTextFieldChange.bind(
                  this,
                  GROUP_DESCRIPTION
                )}
                multiline
                fullWidth
              />

              <TextValidator
                name="members"
                validators={["required"]}
                errorMessages={["This field is required"]}
                label="Group Members"
                placeholder="Placeholder"
                value={this.state.group_members}
                margin="normal"
                variant="outlined"
                onChange={this.handleTextFieldChange.bind(this, GROUP_MEMBERS)}
                helperText='Separate 2 members with a comma, i.e. "Lucy, Bob, ..."'
                multiline
                fullWidth
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    createGroup: state.createGroup
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { createGroupAction: createGroupAction }
  )(withStyles(styles)(CreateGroupDialog))
);
