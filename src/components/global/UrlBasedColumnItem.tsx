import React, { useCallback, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import copy from 'copy-to-clipboard';
import _ from 'lodash';

const UrlBasedColumnItem = ({ url, type = 'other' }: { url: string; type?: 'image' | 'video' | 'other' }) => {
    const _url_split = _.split(url, '.');
    const extension = _url_split[_.size(_url_split) - 1];
    // console.debug({ extension });

    const View = useCallback(() => {
        if (_.includes(['jpeg', 'jpg', 'JPG', 'png', 'PNG', 'gif', 'GIF', 'webp', 'WEBP'], extension))
            return <img src={url} width={100}></img>;

        if (_.includes(['mp4', 'webm'], extension)) return <video src={url} width={100}></video>;

        return <Tag value={_.upperCase(extension)} severity="info" style={{ height: '35px', width: '100px' }}></Tag>;
    }, [extension]);

    return (
        <div className="flex-auto">
            {!type ? (
                <View />
            ) : type === 'image' ? (
                <img src={url} width={100}></img>
            ) : type === 'video' ? (
                <video src={url} width={100}></video>
            ) : null}
            <br />
            <Button
                className="p-button-outlined mt-3"
                label="Copy Link"
                size="small"
                severity="help"
                onClick={e => {
                    e.preventDefault();

                    copy(url);
                }}
                style={{ width: '100px' }}
            />
        </div>
    );
};

export default UrlBasedColumnItem;
