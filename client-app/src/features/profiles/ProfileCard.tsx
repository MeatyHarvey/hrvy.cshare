import React from 'react';
import { observer } from 'mobx-react-lite';
import Profile from '../../app/models/profile';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header content={profile.displayName} />
                <Card.Description content={profile.bio || 'Bio goes here...'} />
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                20 followers!
            </Card.Content>
        </Card>
    );
});