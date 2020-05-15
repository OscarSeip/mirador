import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getManifest,
  getManifestoInstance,
} from '../state/selectors';
import { SidebarCollectionList } from '../components/SidebarCollectionList';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => {
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const { collectionPath } = companionWindow;
  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  const parentCollectionId = collectionPath && collectionPath[collectionPath.length - 2];
  const collection = collectionId && getManifest(state, { manifestId: collectionId });
  const parentCollection = parentCollectionId && getManifest(state, { manifestId: parentCollectionId });
  const manifest = getManifest(state, { windowId });

  return {
    collection: collection && getManifestoInstance(state, { manifestId: collection.id }),
    collectionId,
    collectionPath,
    error: collection && collection.error,
    isFetching: collection && collection.isFetching,
    manifestId: manifest && manifest.id,
    parentCollection: parentCollection && getManifestoInstance(state, { manifestId: parentCollection.id }),
    ready: collection && !!collection.json,
  };
};

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SidebarIndexList
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  fetchManifest: (...args) => dispatch(actions.fetchManifest(...args)),
  updateCompanionWindow: (...args) => dispatch(actions.updateCompanionWindow(windowId, id, ...args)),
  updateWindow: (...args) => dispatch(actions.updateWindow(windowId, ...args)),
});

/**
 * Styles for withStyles HOC
 */
const styles = theme => ({
  label: {
    paddingLeft: theme.spacing(1),
  },
  listItem: {
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing(1),
  },
});

const enhance = compose(
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SidebarCollectionList'),
);

export default enhance(SidebarCollectionList);
