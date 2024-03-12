import React, { useMemo } from 'react';

// third-party
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import _ from 'lodash';

// application
import { getAuthorized } from '../../libs/auth';
import { getBlogTags, getBlogTopics } from '../../apis';
import GenericViewGenerator from '../../components/global/GenericViewGenerator';
import { getGeneralStatusOptions } from '../../utils';
import { UrlBasedColumnItem } from '../../components';

export const getServerSideProps: GetServerSideProps = async context =>
    getAuthorized(context, 'Blog Management | Admin Panel | TripHaat', async cookies => {
        const responseGetBlogTopics = await getBlogTopics(`${cookies.accessType} ${cookies.accessToken}`);
        const responseGetBlogTags = await getBlogTags(`${cookies.accessType} ${cookies.accessToken}`);

        if (
            !responseGetBlogTopics ||
            responseGetBlogTopics.statusCode !== 200 ||
            !responseGetBlogTags ||
            responseGetBlogTags.statusCode !== 200
        ) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }

        return {
            blogTopics: responseGetBlogTopics.data,
            blogTags: responseGetBlogTags.data,
        };
    });

const Page = ({ blogTopics, blogTags }: { blogTopics: any; blogTags: any }) => {
    const router = useRouter();

    return (
        <Card title={''} subTitle="">
            {useMemo(
                () => (
                    <GenericViewGenerator
                        name={'Blog'}
                        title={'Blogs'}
                        subtitle={'Manage blogs here!'}
                        viewAll={{
                            uri: `/api/v1/blogs`,
                            ignoredColumns: ['id', 'content', 'createdAt', 'updatedAt'],
                            actionIdentifier: 'id',
                            scopedColumns: {
                                thumbnailUrl: (item: any) => <UrlBasedColumnItem url={item.thumbnailUrl} />,
                                bannerUrl: (item: any) => <UrlBasedColumnItem url={item.bannerUrl} />,
                            },
                            onDataModify: data =>
                                _.map(data, datum => ({
                                    ...datum,
                                    author: datum?.author?.user?.name,
                                    topic: datum?.topic?.name,
                                    tags: (datum?.tags as any[])?.map(tag => tag?.tag?.name)?.join(', '),
                                })),
                        }}
                        addNew={{
                            uri: `/api/v1/blogs`,
                        }}
                        viewOne={{ uri: '/api/v1/blogs/{id}', identifier: '{id}' }}
                        editExisting={{ uri: '/api/v1/blogs/{id}', identifier: '{id}' }}
                        removeOne={{
                            uri: '/api/v1/blogs/{id}',
                            identifier: '{id}',
                        }}
                        fields={[
                            {
                                type: 'select-sync',
                                name: 'topicId',
                                placeholder: 'Select a topic',
                                title: 'Topic',
                                initialValue: null,
                                options: _.map(blogTopics, (topic: any) => ({
                                    value: topic.id,
                                    label: topic.name,
                                })),
                                isSearchable: true,
                                isClearable: false,
                                validate: (values: any) => {
                                    if (!values.topicId) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'multi-select-sync',
                                name: 'tagIds',
                                placeholder: 'Select tags',
                                title: 'Tags',
                                initialValue: null,
                                options: _.map(blogTags, (tag: any) => ({
                                    value: tag.id,
                                    label: tag.name,
                                })),
                                validate: (values: any) => {
                                    if (!values.tagIds || values.tagIds.length === 0)
                                        return 'Minimum 1 tag required to enter!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'thumbnailUrl',
                                placeholder: 'Submit a square size thumbnail image URL',
                                title: 'Thumbnail',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'bannerUrl',
                                placeholder: 'Submit a banner size image URL',
                                title: 'Banner (Featured Image)',
                                initialValue: null,
                            },
                            {
                                type: 'text',
                                name: 'title',
                                placeholder: 'Enter blog title!',
                                title: 'Title',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.title) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'richtext',
                                name: 'content',
                                placeholder: 'Please enter blog body',
                                title: 'Content',
                                initialValue: null,
                                validate: (values: any) => {
                                    if (!values.content) return 'Required!';

                                    return null;
                                },
                            },
                            {
                                type: 'text',
                                name: 'summary',
                                placeholder: 'Submit a summary of the blog',
                                title: 'Summary',
                                initialValue: null,
                            },
                            {
                                type: 'number',
                                name: 'serial',
                                placeholder: 'Enter a serial!',
                                title: 'Serial',
                                initialValue: 9999,
                                validate: (values: any) => {
                                    if (!values.serial) return 'Serial required!';

                                    return null;
                                },
                            },
                            {
                                type: 'select-sync',
                                name: 'status',
                                placeholder: 'Select a status!',
                                title: 'Status',
                                initialValue: 'ACTIVE',
                                options: getGeneralStatusOptions(),
                                validate: (values: any) => {
                                    if (!values.status) return 'Status required!';

                                    return null;
                                },
                            },
                        ]}
                    />
                ),
                [blogTags, blogTopics]
            )}
        </Card>
    );
};

export default Page;
