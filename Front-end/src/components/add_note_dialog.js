import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addNoteAction } from "../actions/add_note_action";
import { getUserDetailsAction } from "../actions/get_user_details_action";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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

const NOTE_TITLE = "title";
const NOTE_CONTENT = "note_content";
const LABELS = "labels";
// const GROUPS = "groups";

class AddNoteDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      note_content: "",
      labels: "",
      groups: "",
      radioValue: "all"
    };
  }

  componentDidMount() {
    console.log(this.props.groupNameInDropDown);
    if (this.props.authentication) {
      this.props.getUserDetailsAction(this.props.authentication.token);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the add note response was received.
    if (this.props.addNote && this.props.addNote != prevProps.addNote) {
      console.log("Add Notes Response : " + JSON.stringify(this.props.addNote));
      //TODO Show error if add note failed based on responsecode.
      this.props.dismissDialog();
    }
  }

  handleTextFieldChange = (fieldId, event) => {
    switch (fieldId) {
      case NOTE_TITLE:
        this.setState({ title: event.target.value });
        break;
      case NOTE_CONTENT:
        this.setState({ note_content: event.target.value });
        break;
      case LABELS:
        this.setState({ labels: event.target.value });
        break;
    }
  };

  handleRadioValueChange = event => {
    this.setState({ radioValue: event.target.value });
  };

  handleGroupChange = event => {
    this.setState({ groups: event.target.value });
  };

  handleClose = () => {
    // this.myDebugInfo();

    this.props.dismissDialog();
  };

  handleSubmit = () => {
    // this.myDebugInfo();
    var currentGroup = this.props.isShowingGroupNote ? this.props.groupNameInDropDown : this.state.groups;

    this.props.addNoteAction(this.state.title, this.state.radioValue, this.state.note_content, this.state.labels, currentGroup, this.props.authentication.token);
    this.clearState();
  };

  clearState = () => {
    this.setState({
      title: "",
      note_content: "",
      labels: "",
      groups: "",
      radioValue: "all"
    });
  };

  myDebugInfo = () => {
    console.log(
      "add_note_dialog.js - token: " + this.props.authentication.token
    );

    console.log("add_note_dialog.js - title: " + this.state.title);
    console.log(
      "add_note_dialog.js - note_content: " + this.state.note_content
    );
    console.log("add_note_dialog.js - labels: " + this.state.labels);
    console.log("add_note_dialog.js - groups: " + this.state.groups);
    console.log("add_note_dialog.js - visibility: " + this.state.radioValue);
  };

  getGroupItems = () => {
    if (this.props.userDetails && this.props.userDetails.user.groups) {
      return this.props.userDetails.user.groups.map(group => (
        <MenuItem value={group}>{group}</MenuItem>
      ));
    }
  };

  render() {
    const { classes } = this.props;
    const groupItems = this.getGroupItems();

    //console.log(groupItems);
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          scroll="body" // "paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Add a New Note</DialogTitle>

          <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
            <DialogContent>
              <TextValidator
                name="title"
                label="Note Title"
                value={this.state.title}
                validators={["required"]}
                errorMessages={["This field is required"]}
                variant="outlined"
                margin="normal"
                onChange={this.handleTextFieldChange.bind(this, NOTE_TITLE)}
                fullWidth
              />

              <FormControl component="fieldset" className={classes.section}>
                <FormLabel component="legend">Note Visibility</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="visibility"
                  className={classes.radioGroup}
                  value={this.state.radioValue}
                  onChange={this.handleRadioValueChange}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="private"
                    control={<Radio />}
                    label="Private"
                  />
                </RadioGroup>
              </FormControl>

              <TextValidator
                name="content"
                validators={["required"]}
                errorMessages={["This field is required"]}
                label="Note Content"
                placeholder="Placeholder"
                value={this.state.note_content}
                margin="normal"
                variant="outlined"
                onChange={this.handleTextFieldChange.bind(this, NOTE_CONTENT)}
                multiline
                fullWidth
              />

              <TextField
                label="Labels (Optional)"
                variant="outlined"
                margin="normal"
                value={this.state.labels}
                onChange={this.handleTextFieldChange.bind(this, LABELS)}
                helperText='Separate 2 labels with a comma, i.e. "Tag1, Tag2, ..."'
                fullWidth
              />

              {!this.props.isShowingGroupNote && (
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="group-simple">Group (Optional)</InputLabel>
                <Select
                  value={this.state.groups}
                  onChange={this.handleGroupChange}
                  inputProps={{
                    name: "group",
                    id: "group-simple"
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {groupItems}
                </Select>
              </FormControl>)
              }
              {this.props.isShowingGroupNote && (
              <FormControl className={classes.formControl} disabled fullWidth>
                <InputLabel htmlFor="group-simple">Group (Optional)</InputLabel>
                <Select
                  value={this.props.groupNameInDropDown}
                  onChange={this.handleGroupChange}
                  inputProps={{
                    name: "group",
                    id: "group-simple"
                  }}
                >
                  <MenuItem value={this.props.groupNameInDropDown}>
                    {this.props.groupNameInDropDown}
                  </MenuItem>
                </Select>
              </FormControl>)
              }
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
    addNote: state.addNote,
    userDetails: state.userDetails
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { addNoteAction: addNoteAction, getUserDetailsAction: getUserDetailsAction }
  )(withStyles(styles)(AddNoteDialog))
);
