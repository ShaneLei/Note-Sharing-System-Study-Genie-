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
import { editNoteAction } from "../actions/edit_note_action";
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

const NOTE_TITLE = "title";
const NOTE_CONTENT = "note_content";
const LABELS = "labels";
const GROUPS = "groups";

class EditNoteDialog extends React.Component {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the add note response was received.
    if (this.props.editNote && this.props.editNote != prevProps.editNote) {
      console.log("Edit Notes Response : " + JSON.stringify(this.props.editNote));
      //TODO Show error if add note failed based on responsecode.
      this.props.dismissDialog();
    }

    // TODO - for current backend, if you do not edit all the textfield, you cannot successfully edit a note.
    // i.e. if you only edit the title or the content, you will get an error response.
    if (this.props.note && this.props.note !== prevProps.note) {
      this.setState({
        title: this.props.note.title,
        note_content: this.props.note.note_content,
        labels: this.props.note.labels,
        groups: this.props.note.groups,
        radioValue: this.props.note.visibility
      })
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
      case GROUPS:
        this.setState({ groups: event.target.value });
        break;
    }
  };

  handleRadioValueChange = event => {
    this.setState({ radioValue: event.target.value });
  };

  handleClose = () => {
    this.props.dismissDialog();
  };

  handleSubmit = () => {
    var token = this.props.authentication.token;
    var id = this.props.note._id.$oid;
    var title = this.state.title;
    var content = this.state.note_content;
    var radioValue = this.state.radioValue;
    var labels = this.state.labels;
    var groups = this.state.groups;

    this.props.editNoteAction(token, id, title, content, radioValue, labels, groups);
    
    // this.myDebugInfo();
  };

  myDebugInfo = () => {

    console.log("edit_note_dialog.js - title: " + this.state.title);
    console.log(
      "edit_note_dialog.js - note_content: " + this.state.note_content
    );
    console.log("edit_note_dialog.js - labels: " + this.state.labels);
    console.log("edit_note_dialog.js - groups: " + this.state.groups);
    console.log("edit_note_dialog.js - visibility: " + this.state.radioValue);
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
          <DialogTitle id="scroll-dialog-title">Edit the Note</DialogTitle>

          <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
            <DialogContent>
              <TextValidator
                name="title"
                label="Note Title"
                value={this.state.title}
                validators={['required']}
                errorMessages={['This field is required']}
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
                  <FormControlLabel
                    value="group"
                    control={<Radio />}
                    label="Group"
                  />
                </RadioGroup>
              </FormControl>

              <TextValidator
                name="content"
                validators={['required']}
                errorMessages={['This field is required']}
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

              <TextField
                label="Groups (Optional)"
                variant="outlined"
                margin="normal"
                value={this.state.groups}
                onChange={this.handleTextFieldChange.bind(this, GROUPS)}
                helperText='Separate 2 groups with a comma, i.e. "Group1, Group2, ..."'
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
    editNote: state.editNote
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { editNoteAction: editNoteAction }
  )(withStyles(styles)(EditNoteDialog))
);
