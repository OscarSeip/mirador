import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import RootRef from '@material-ui/core/RootRef';
import Select from '@material-ui/core/Select';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CompanionWindow from '../containers/CompanionWindow';
import SidebarIndexList from '../containers/SidebarIndexList';
import SidebarIndexTableOfContents from '../containers/SidebarIndexTableOfContents';
import SidebarCollectionList from '../containers/SidebarCollectionList';

/**
 * a panel showing the canvases for a given manifest
 */
export class WindowSideBarCanvasPanel extends Component {
  /** */
  constructor(props) {
    super(props);
    this.handleVariantChange = this.handleVariantChange.bind(this);

    this.state = {
      variantSelectionOpened: false,
    };

    this.containerRef = React.createRef();
  }

  /** */
  static getUseableLabel(resource, index) {
    return (resource
      && resource.getLabel
      && resource.getLabel().length > 0)
      ? resource.getLabel().map(label => label.value)[0]
      : resource.id;
  }

  /** @private */
  handleVariantChange(event) {
    const { updateVariant } = this.props;

    updateVariant(event.target.value);
    this.setState({ variantSelectionOpened: false });
  }

  /**
   * render
   */
  render() {
    const {
      classes,
      collection,
      collectionPath,
      id,
      setShowMultipart,
      showMultipart,
      t,
      toggleDraggingEnabled,
      variant,
      windowId,
    } = this.props;

    const { variantSelectionOpened } = this.state;
    let listComponent;

    if (showMultipart) {
      listComponent = (
        <SidebarCollectionList
          id={id}
          containerRef={this.containerRef}
          windowId={windowId}
        />
      );
    } else if (variant === 'tableOfContents') {
      listComponent = (
        <SidebarIndexTableOfContents
          id={id}
          containerRef={this.containerRef}
          windowId={windowId}
        />
      );
    } else {
      listComponent = (
        <SidebarIndexList
          id={id}
          containerRef={this.containerRef}
          windowId={windowId}
        />
      );
    }
    return (
      <RootRef rootRef={this.containerRef}>
        <CompanionWindow
          title={t('canvasIndex')}
          id={id}
          windowId={windowId}
          titleControls={(
            <FormControl>
              <Select
                MenuProps={{
                  anchorOrigin: {
                    horizontal: 'left',
                    vertical: 'bottom',
                  },
                  getContentAnchorEl: null,
                }}
                displayEmpty
                value={variant}
                onChange={this.handleVariantChange}
                name="variant"
                open={variantSelectionOpened}
                onOpen={(e) => {
                  toggleDraggingEnabled();
                  this.setState({ variantSelectionOpened: true });
                }}
                onClose={(e) => {
                  toggleDraggingEnabled();
                  this.setState({ variantSelectionOpened: false });
                }}
                classes={{ select: classes.select }}
                className={classes.selectEmpty}
              >
                <MenuItem value="tableOfContents"><Typography variant="body2">{ t('tableOfContentsList') }</Typography></MenuItem>
                <MenuItem value="item"><Typography variant="body2">{ t('itemList') }</Typography></MenuItem>
                <MenuItem value="thumbnail"><Typography variant="body2">{ t('thumbnailList') }</Typography></MenuItem>
              </Select>
            </FormControl>
          )}
        >
          { !showMultipart && collectionPath.length > 0 && (
            <ListItem button onClick={() => setShowMultipart(collectionPath)}>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                {WindowSideBarCanvasPanel.getUseableLabel(collection)}
              </ListItemText>
            </ListItem>
          )}
          {listComponent}
        </CompanionWindow>
      </RootRef>
    );
  }
}

WindowSideBarCanvasPanel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  collection: PropTypes.object,
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  setShowMultipart: PropTypes.func.isRequired,
  showMultipart: PropTypes.bool,
  t: PropTypes.func.isRequired,
  toggleDraggingEnabled: PropTypes.func.isRequired,
  updateVariant: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['item', 'thumbnail', 'tableOfContents']).isRequired,
  windowId: PropTypes.string.isRequired,
};

WindowSideBarCanvasPanel.defaultProps = {
  collection: null,
  collectionPath: [],
  showMultipart: false,
};
