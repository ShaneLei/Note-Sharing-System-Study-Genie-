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
import { editGroupAction } from "../actions/edit_group_action";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

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
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 500
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  },
  select: {
    minWidth: 230
  }
});

// const GROUP_NAME = "group name";
// const GROUP_DESCRIPTION = "group description";
// const GROUP_MEMBERS = "group members";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

var names = [];

class AddMemberDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group_id: "",
      group_name: "",
      group_description: "",
      group_members: "",
      name: []
    };
  }

  componentDidMount() {
    if (this.props.getUsers) {
      names = this.props.getUsers.users;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Check if the edit group response was received.
    if (this.props.editGroup && this.props.editGroup != prevProps.editGroup) {
      console.log(
        "Add Member Response : " + JSON.stringify(this.props.editGroup)
      );
      this.clearState();
      //TODO Show error if edit group failed based on responsecode.
      this.props.dismissDialog();
    }

    if (this.props.group && this.props.group !== prevProps.group) {
      console.log(this.props.group);
      this.setState({
        group_id: this.props.group._id.$oid,
        group_name: this.props.group.group_name,
        group_description: this.props.group.description,
        group_members: this.props.group.members
      });
    }

    if (
      prevState.group_members &&
      this.state.group_members &&
      this.state.group_members !== prevState.group_members &&
      this.state.group_id == prevState.group_id
    ) {
      this.props.editGroupAction(
        this.props.authentication.token,
        this.state.group_id,
        this.state.group_name,
        this.state.group_members,
        this.state.group_description
      );
      this.clearState();
    }
  }

  handleClose = () => {
    // this.myDebugInfo();

    this.props.dismissDialog();
  };

  handleSubmit = () => {
    // this.myDebugInfo();

    console.log(
      "handleSubmit state " +
        this.state.group_members +
        " " +
        this.state.group_id +
        " " +
        this.props.authentication.token +
        " " +
        this.state.group_description +
        " " +
        this.state.group_name
    );
    var members = JSON.parse(JSON.stringify(this.state.group_members));
    for (var i = 0; i < this.state.name.length; i++) {
      members = members + "," + this.state.name[i];
    }
    this.setState({
      group_members: members
    });
  };

  clearState = () => {
    this.setState({
      group_id: "",
      group_name: "",
      group_description: "",
      group_members: "",
      name: []
    });
  };

  handleChange = event => {
    console.log(event.target.value);
    this.setState({
      name: event.target.value
    });
    console.log("handleChange state " + this.state.name);
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
          <DialogTitle id="scroll-dialog-title">Add Group Members</DialogTitle>

          <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
            <DialogContent>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">
                  Choose Members To Add
                </InputLabel>
                <Select
                  multiple
                  value={this.state.name}
                  onChange={this.handleChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                  className={classes.select}
                >
                  {names.map(name => (
                    <MenuItem
                      key={name}
                      value={name}
                      //   style={getStyles(name, this)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
    createGroup: state.createGroup,
    getUsers: state.getUsers,
    editGroup: state.editGroup
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { createGroupAction: createGroupAction, editGroupAction: editGroupAction }
  )(withStyles(styles)(AddMemberDialog))
);
