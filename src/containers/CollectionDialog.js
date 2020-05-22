import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getManifest, getManifestoInstance, getManifestBehaviors } from '../state/selectors';
import { CollectionDialog } from '../components/CollectionDialog';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof CollectionDialog
 * @private
 */
const mapDispatchToProps = {
  addWindow: actions.addWindow,
  fetchManifest: actions.fetchManifest,
  hideCollectionDialog: actions.hideCollectionDialog,
  setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility,
  showCollectionDialog: actions.showCollectionDialog,
  updateWindow: actions.updateWindow,
};

/**
 * mapStateToProps - to hook up connect
 * @memberof CollectionDialog
 * @private
 */
const mapStateToProps = (state) => {
  const { collectionPath, collectionManifestId: manifestId } = state.workspace;
  const manifest = getManifest(state, { manifestId });

  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  const collection = collectionId && getManifest(state, { manifestId: collectionId });

  return {
    collection: collection && getManifestoInstance(state, { manifestId: collection.id }),
    collectionPath,
    error: manifest && manifest.error,
    isFetching: manifest && manifest.isFetching,
    isMultipart: getManifestBehaviors(state, { manifestId }).includes('multi-part'),
    manifest: manifest && getManifestoInstance(state, { manifestId }),
    manifestId,
    open: state.workspace.collectionDialogOn,
    ready: manifest && !!manifest.json,
    windowId: state.workspace.collectionUpdateWindowId,
  };
};

/** */
const styles = theme => ({
  collectionFilter: {
    padding: '16px',
    paddingTop: 0,
  },
  collectionMetadata: {
    padding: '16px',
  },
  dark: {
    color: '#000000',
  },
  dialogContent: {
    padding: 0,
  },
  light: {
    color: '#BDBDBD',
  },
  listitem: {
    '&:focus': {
      backgroundColor: theme.palette.action.focus,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
  },
});


const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CollectionDialog'),
);

export default enhance(CollectionDialog);
