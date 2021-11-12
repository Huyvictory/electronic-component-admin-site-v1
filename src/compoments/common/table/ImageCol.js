import React from 'react';
import {  PictureOutlined } from '@ant-design/icons';

const ImageCol = ({ path, className }) => {
    if(path)
        return (
            <img className={ className || 'img-col'} src={path} alt=""/>
        )
    return <PictureOutlined className="empty-img-col"/>
}

export default ImageCol;
