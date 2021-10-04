import React from 'react';
import { Tag } from 'antd';

import Utils from '../../../utils';

const KindTag = ({kind}) => {
    const kindItem = Utils.getCommonKindItem(kind);
 
        if(kindItem)
            return (
                <Tag className="tag-kind" color={kindItem.color}>
                    {kindItem.label}
                </Tag>
            )
        return null;
}

export default KindTag;