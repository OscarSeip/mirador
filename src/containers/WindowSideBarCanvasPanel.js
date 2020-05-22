import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { WindowSideBarCanvasPanel } from '../components/WindowSideBarCanvasPanel';
import {
  getCompanionWindow,
  getDefaultSidebarVariant,
  getManifestCanvases,
  getVisibleCanvases,
  getWindow,
  getManifestoInstance,
} from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => {
  const window = getWindow(state, { windowId });
  const canvases = getManifestCanvases(state, { windowId });
  const { config } = state;
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const collectionPath = window.collectionPath || [];
  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  return {
    canvases,
    collection: collectionId && getManifestoInstance(state, { manifestId: collectionId }),
    collectionPath,
    config,
    selectedCanvases: getVisibleCanvases(state, { windowId }),
    showMultipart: companionWindow.multipart,
    variant: companionWindow.variant
      || getDefaultSidebarVariant(state, { windowId }),
  };
};

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof WindowSideBarCanvasPanel
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
  setShowMultipart: collectionPath => dispatch(
    actions.updateCompanionWindow(windowId, id, { collectionPath, multipart: true }),
  ),
  toggleDraggingEnabled: () => dispatch(actions.toggleDraggingEnabled()),
  updateVariant: variant => dispatch(
    actions.updateCompanionWindow(windowId, id, { variant }),
  ),
});

/**
 *
 * @param theme
 */
const styles = theme => ({
  label: {
    paddingLeft: theme.spacing(1),
  },
  select: {
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  selectEmpty: {
    backgroundColor: theme.palette.background.paper,
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowSideBarCanvasPanel'),
);

export default enhance(WindowSideBarCanvasPanel);
