import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import Activity from '../../../app/models/activity';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
    activity: Activity
}

export default observer(function ActivityListItem({activity}: Props) {
    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' style={{ align: 'center' }} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image
                            style={{ marginBottom: 10 }}
                            size='tiny'
                            circular
                            src={activity.host?.image || '/assets/user.png'}
                        />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>
                                Hosted by <Link to={`/profiles/${activity.host?.username}`}>{activity.host?.displayName}</Link>
                            </Item.Description>
                            <Item.Extra>
                                <Label basic content={activity.category} />
                                {activity.isHost &&
                                    <Label basic color='orange' content='Hosting' />
                                }
                                {activity.isGoing && !activity.isHost && (
                                    <Label basic color='green' content='Going' />
                                )}
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <p />
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment secondary clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
})