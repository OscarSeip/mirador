import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBackSharp';
import IIIFThumbnail from '../containers/IIIFThumbnail';

/** */
export class SidebarCollectionList extends Component {
  /** */
  static getUseableLabel(resource, index) {
    return (resource
      && resource.getLabel
      && resource.getLabel().length > 0)
      ? resource.getLabel().map(label => label.value)[0]
      : resource.id;
  }

  /** */
  componentDidMount() {
    this.fetchManifestIfNeeded();
  }

  /** */
  componentDidUpdate(prevProps) {
    const { collectionId } = this.props;

    if (prevProps.collectionId !== collectionId) this.fetchManifestIfNeeded();
  }

  /** */
  fetchManifestIfNeeded() {
    const {
      error, fetchManifest, isFetching, collectionId, ready,
    } = this.props;

    if (!ready && !error && !isFetching) fetchManifest(collectionId, { hide: true });
  }

  isMultipart() {
    const { collection } = this.props;

    const behaviors = collection.getProperty('behavior');

    if (Array.isArray(behaviors)) return collection.includes('multi-part');

    return behaviors === 'multi-part';
  }

  /** */
  render() {
    const {
      canvasNavigation,
      classes,
      collectionPath,
      collection,
      manifestId,
      parentCollection,
      updateCompanionWindow,
      updateWindow,
      t,
      variant,
    } = this.props;

    if (!collection) return <></>;

    const collections = collection.getCollections();
    const manifests = collection.getManifests();

    return (
      <List>
        { parentCollection && (
          <ListItem
            button
            onClick={() => updateCompanionWindow({ collectionPath: collectionPath.slice(0, -1) })}
          >
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
              {SidebarCollectionList.getUseableLabel(parentCollection)}
            </ListItemText>
          </ListItem>
        )}
        <ListItem>
          <ListItemText primaryTypographyProps={{ variant: 'h6' }}>
            <Typography component="div" variant="overline">
              { t(this.isMultipart() ? 'multipartCollection' : 'collection') }
            </Typography>
            {SidebarCollectionList.getUseableLabel(collection)}
          </ListItemText>
        </ListItem>
        {
          collections.map((manifest) => {
            /** select the new manifest and go back to the normal index */
            const onClick = () => {
              // close collection
              updateCompanionWindow({ collectionPath: [...collectionPath, manifest.id] });
            };

            return (
              <ListItem
                key={manifest.id}
                className={classes.listItem}
                alignItems="flex-start"
                onClick={onClick}
                button
                component="li"
              >
                { variant === 'thumbnail' && (
                  <ListItemIcon>
                    <IIIFThumbnail
                      resource={manifest}
                      maxHeight={canvasNavigation.height}
                      maxWidth={canvasNavigation.width}
                    />
                  </ListItemIcon>
                )}
                <ListItemText>{SidebarCollectionList.getUseableLabel(manifest)}</ListItemText>
              </ListItem>
            );
          })
        }
        {
          manifests.map((manifest) => {
            /** select the new manifest and go back to the normal index */
            const onClick = () => {
              // select new manifest
              updateWindow({ collectionPath, manifestId: manifest.id });
              // close collection
              updateCompanionWindow({ multipart: false });
            };

            return (
              <ListItem
                key={manifest.id}
                className={classes.listItem}
                alignItems="flex-start"
                onClick={onClick}
                button
                component="li"
                selected={manifestId === manifest.id}
              >
                { variant === 'thumbnail' && (
                  <ListItemIcon>
                    <IIIFThumbnail
                      resource={manifest}
                      maxHeight={canvasNavigation.height}
                      maxWidth={canvasNavigation.width}
                    />
                  </ListItemIcon>
                )}
                <ListItemText>{SidebarCollectionList.getUseableLabel(manifest)}</ListItemText>
              </ListItem>
            );
          })
        }
      </List>
    );
  }
}

SidebarCollectionList.propTypes = {
  canvasNavigation: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  collection: PropTypes.object,
  collectionId: PropTypes.string.isRequired,
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  fetchManifest: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  manifestId: PropTypes.string.isRequired,
  parentCollection: PropTypes.object,
  ready: PropTypes.bool,
  t: PropTypes.func,
  updateCompanionWindow: PropTypes.func.isRequired,
  updateWindow: PropTypes.func.isRequired,
  variant: PropTypes.string,
};

SidebarCollectionList.defaultProps = {
  collection: null,
  collectionPath: [],
  error: null,
  isFetching: false,
  ready: false,
  t: k => k,
  variant: null,
};
