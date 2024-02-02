import React, { useCallback, useMemo } from 'react';
import { Button } from 'primereact/button';
import copy from 'copy-to-clipboard';
import _ from 'lodash';

const UrlBasedColumnItem = ({ url }: { url: string }) => {
    const getView = useCallback(() => {
        if (_.isUndefined(url) || _.isNull(url)) return null;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'webm'];
        const docExtensions = ['.pdf'];
        const extensions = [...imageExtensions, ...videoExtensions, ...docExtensions];

        for (let i = 0; i < _.size(extensions); i++) {
            // console.debug({ extension: extensions[i] });

            if (
                !_.isUndefined(url) &&
                !_.isNull(url) &&
                _.includes(url.toLowerCase(), '.' + extensions[i]) &&
                _.includes(imageExtensions, extensions[i])
            ) {
                return (
                    <a href={url} target="_blank" rel="noreferrer">
                        <img src={url} width={100} />
                    </a>
                );
            } else if (
                !_.isUndefined(url) &&
                !_.isNull(url) &&
                _.includes(url.toLowerCase(), '.' + extensions[i]) &&
                videoExtensions.includes(extensions[i])
            ) {
                return (
                    <a href={url} target="_blank" rel="noreferrer">
                        <video src={url} width={100} />
                    </a>
                );
            }
        }

        return (
            <a href={url} target="_blank" rel="noreferrer">
                {url}
            </a>
        );
    }, [url]);

    return useMemo(
        () => (
            <div className="flex-auto">
                {_.isUndefined(url) || _.isNull(url) ? null : getView()}
                <br />
                {_.isUndefined(url) || _.isNull(url) || _.isEqual(url, '') ? null : (
                    <Button
                        className="p-button-outlined align-items mt-3"
                        label="Copy Link"
                        size="small"
                        severity="help"
                        onClick={e => {
                            e.preventDefault();

                            copy(url);
                        }}
                        style={{ width: '100px' }}
                    />
                )}
            </div>
        ),
        []
    );
};

export default UrlBasedColumnItem;
