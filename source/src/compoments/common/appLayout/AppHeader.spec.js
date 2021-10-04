import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import AppHeader from './AppHeader';

const baseProps = {
    userData: {
        name: 'Thi'
    }
}

describe('components/common/appLayout/AppHeader AppHeader', () => {
    it('Display user on the top menu', () => {
        const wrapper = shallow(<AppHeader {...baseProps} />);
        expect(wrapper.render().find('.submenu-title-wrapper').text()).to.be.equal('Welcome: Thi');
    });
});
