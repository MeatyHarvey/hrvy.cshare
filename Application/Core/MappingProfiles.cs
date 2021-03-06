#nullable disable

using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.HostUsername, o => o
                    .MapFrom(s => s.Attendees
                        .FirstOrDefault(x => x.IsHost).User.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o
                    .MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Username, o => o
                    .MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o
                    .MapFrom(s => s.User.Bio))
                .ForMember(d => d.Image, o => o
                    .MapFrom(s => s.User.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o
                    .MapFrom(s => s.User.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o
                    .MapFrom(s => s.User.Followings.Count))
                .ForMember(d => d.Following, o => o
                    .MapFrom(s => s.User.Followers.Any(f => f.Observer.UserName == currentUsername)));

            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, o => o
                    .MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Title, o => o
                    .MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o
                    .MapFrom(s => s.Activity.Category))
                .ForMember(d => d.Date, o => o
                    .MapFrom(s => s.Activity.Date))
                .ForMember(d => d.IsCancelled, o => o
                    .MapFrom(s => s.Activity.IsCancelled))
                .ForMember(d => d.HostUsername, o => o
                    .MapFrom(s => s.Activity.Attendees.FirstOrDefault(a => a.IsHost).User.UserName));

            CreateMap<User, Profiles.Profile>()
                .ForMember(d => d.Image, o => o
                    .MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o
                    .MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o
                    .MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following, o => o
                    .MapFrom(s => s.Followers.Any(f => f.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o
                    .MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o
                    .MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o
                    .MapFrom(s => s.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}