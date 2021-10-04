import React from 'react';
import { Tag } from 'antd';

import Utils from '../../../utils';

const StatusTag = ({status}) => {
    const statusItem = Utils.getCommonStatusItem(status);
 
        if(statusItem)
            return (
                <Tag className="tag-status" color={statusItem.color}>
                    {statusItem.label}
                </Tag>
            )
        return null;
}

export default StatusTag;